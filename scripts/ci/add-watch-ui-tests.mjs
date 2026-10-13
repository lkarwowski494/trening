// Dodaje do wygenerowanego projektu Xcode (po `expo prebuild`) cel testów interfejsu zegarka (XCUITest) i jego schemat — wtyczka apple-targets
// takiego celu nie tworzy (docs/36). Źródła testów: targets/watch-ui-tests (katalog zsynchronizowany z celem, jak cele apple-targets).
// Użycie: node scripts/ci/add-watch-ui-tests.mjs [katalog_ios]   (domyślnie ./ios). Idempotentne: drugi przebieg nic nie zmienia.
// Sprawdzane bez Maca w scripts/verify-native.mjs (projekt otwiera się ponownie, cel i schemat istnieją); uruchamiane w CI: watch-sim.yml.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)), '..');
const iosDir = resolve(process.argv[2] || join(root, 'ios'));
const requireFromTargets = createRequire(require_resolve('@bacons/apple-targets'));
function require_resolve(name) { return createRequire(join(root, 'package.json')).resolve(name); }
const xcode = requireFromTargets('@bacons/xcode');
const xcodeJson = requireFromTargets('@bacons/xcode/json');
const { XcodeProject, PBXNativeTarget, PBXFileReference, PBXGroup, XCConfigurationList, XCBuildConfiguration, PBXFileSystemSynchronizedRootGroup, PBXFileSystemSynchronizedBuildFileExceptionSet } = xcode;
const app = JSON.parse(readFileSync(join(root, 'app.json'), 'utf8')).expo;

export const WATCH_APP = 'TreningWatch';
export const UI_TESTS = 'TreningWatchUITests';

const projDirName = readdirSync(iosDir).find(f => f.endsWith('.xcodeproj'));
if (!projDirName) { console.error('Brak *.xcodeproj w ' + iosDir + ' — najpierw: npx expo prebuild --platform ios --no-install --clean'); process.exit(1); }
const pbxPath = join(iosDir, projDirName, 'project.pbxproj');
const project = XcodeProject.open(pbxPath);
const targets = project.rootObject.props.targets;
const watch = targets.find(t => PBXNativeTarget.is(t) && t.props.productName === WATCH_APP);
if (!watch) { console.error('Brak celu ' + WATCH_APP + ' w projekcie (apple-targets: targets/watch-app)'); process.exit(1); }
const teamId = watch.getDefaultBuildSetting('DEVELOPMENT_TEAM');
let ui = targets.find(t => PBXNativeTarget.is(t) && t.props.productName === UI_TESTS);

if (!ui) {
  const productRef = PBXFileReference.create(project, { explicitFileType: 'wrapper.cfbundle', includeInIndex: 0, path: UI_TESTS + '.xctest', sourceTree: 'BUILT_PRODUCTS_DIR' });
  project.rootObject.ensureProductGroup().props.children.push(productRef);
  const common = {
    CODE_SIGN_STYLE: 'Automatic', CURRENT_PROJECT_VERSION: 1, GENERATE_INFOPLIST_FILE: 'YES', MARKETING_VERSION: app.version,
    PRODUCT_BUNDLE_IDENTIFIER: app.ios.bundleIdentifier + '.watchkitapp.uitests', PRODUCT_NAME: '$(TARGET_NAME)', SDKROOT: 'watchos', SUPPORTED_PLATFORMS: 'watchos watchsimulator',
    SWIFT_VERSION: '5.0', TARGETED_DEVICE_FAMILY: '4', TEST_TARGET_NAME: WATCH_APP, WATCHOS_DEPLOYMENT_TARGET: '11.0',
    SWIFT_EMIT_LOC_STRINGS: 'NO', ...(teamId ? { DEVELOPMENT_TEAM: teamId } : {}),
  };
  const list = XCConfigurationList.create(project, {
    buildConfigurations: [
      XCBuildConfiguration.create(project, { name: 'Debug', buildSettings: { ...common, SWIFT_OPTIMIZATION_LEVEL: '-Onone', SWIFT_ACTIVE_COMPILATION_CONDITIONS: 'DEBUG', DEBUG_INFORMATION_FORMAT: 'dwarf' } }),
      XCBuildConfiguration.create(project, { name: 'Release', buildSettings: { ...common, SWIFT_COMPILATION_MODE: 'wholemodule', SWIFT_OPTIMIZATION_LEVEL: '-O', DEBUG_INFORMATION_FORMAT: 'dwarf-with-dsym' } }),
    ],
    defaultConfigurationIsVisible: 0, defaultConfigurationName: 'Release',
  });
  ui = project.rootObject.createNativeTarget({ name: UI_TESTS, productName: UI_TESTS, productReference: productRef, productType: 'com.apple.product-type.bundle.ui-testing', buildConfigurationList: list });
  ui.getSourcesBuildPhase(); ui.getResourcesBuildPhase(); ui.getFrameworksBuildPhase();
  ui.addDependency(watch);
  // Źródła: katalog targets/watch-ui-tests jako grupa zsynchronizowana (jak cele apple-targets), w grupie „expo:targets”.
  const protectedGroup = project.rootObject.props.mainGroup.getChildGroups().find(g => g.getDisplayName() === 'expo:targets');
  if (!protectedGroup) { console.error('Brak grupy expo:targets — projekt nie pochodzi z apple-targets'); process.exit(1); }
  const sync = PBXFileSystemSynchronizedRootGroup.create(project, { path: 'watch-ui-tests', exceptions: [], explicitFileTypes: {}, explicitFolders: [], sourceTree: '<group>' });
  if (!ui.props.fileSystemSynchronizedGroups) ui.props.fileSystemSynchronizedGroups = [];
  ui.props.fileSystemSynchronizedGroups.push(sync);
  protectedGroup.props.children.push(sync);
  // Atrybuty projektu: cel testowy wskazuje testowaną aplikację.
  const attrs = project.rootObject.props.attributes; attrs.TargetAttributes ??= {};
  attrs.TargetAttributes[ui.uuid] = { CreatedOnToolsVersion: '16.0', TestTargetID: watch.uuid, ...(teamId ? { DevelopmentTeam: teamId } : {}) };
  writeFileSync(pbxPath, xcodeJson.build(project.toJSON()));
}
export const ids = { watch: watch.uuid, ui: ui.uuid };

// Schemat współdzielony: budowanie aplikacji zegarka + uruchomienie testów interfejsu (bez zależności od automatycznie tworzonych schematów).
const ref = (id, name, file) => `<BuildableReference BuildableIdentifier="primary" BlueprintIdentifier="${id}" BuildableName="${file}" BlueprintName="${name}" ReferencedContainer="container:${projDirName}"></BuildableReference>`;
const scheme = `<?xml version="1.0" encoding="UTF-8"?>
<Scheme LastUpgradeVersion="1600" version="1.7">
  <BuildAction parallelizeBuildables="YES" buildImplicitDependencies="YES">
    <BuildActionEntries>
      <BuildActionEntry buildForTesting="YES" buildForRunning="YES" buildForProfiling="NO" buildForArchiving="NO" buildForAnalyzing="YES">
        ${ref(watch.uuid, WATCH_APP, WATCH_APP + '.app')}
      </BuildActionEntry>
    </BuildActionEntries>
  </BuildAction>
  <TestAction buildConfiguration="Debug" selectedDebuggerIdentifier="Xcode.DebuggerFoundation.Debugger.LLDB" selectedLauncherIdentifier="Xcode.DebuggerFoundation.Launcher.LLDB" shouldUseLaunchSchemeArgsEnv="YES">
    <Testables>
      <TestableReference skipped="NO" parallelizable="NO">
        ${ref(ui.uuid, UI_TESTS, UI_TESTS + '.xctest')}
      </TestableReference>
    </Testables>
  </TestAction>
  <LaunchAction buildConfiguration="Debug" selectedDebuggerIdentifier="Xcode.DebuggerFoundation.Debugger.LLDB" selectedLauncherIdentifier="Xcode.DebuggerFoundation.Launcher.LLDB" launchStyle="0" useCustomWorkingDirectory="NO" ignoresPersistentStateOnLaunch="NO" debugDocumentVersioning="YES" debugServiceExtension="internal" allowLocationSimulation="YES">
    <BuildableProductRunnable runnableDebuggingMode="0">
      ${ref(watch.uuid, WATCH_APP, WATCH_APP + '.app')}
    </BuildableProductRunnable>
  </LaunchAction>
  <ProfileAction buildConfiguration="Release" shouldUseLaunchSchemeArgsEnv="YES" savedToolIdentifier="" useCustomWorkingDirectory="NO" debugDocumentVersioning="YES"></ProfileAction>
  <AnalyzeAction buildConfiguration="Debug"></AnalyzeAction>
  <ArchiveAction buildConfiguration="Release" revealArchiveInOrganizer="YES"></ArchiveAction>
</Scheme>
`;
const schemeDir = join(iosDir, projDirName, 'xcshareddata', 'xcschemes');
mkdirSync(schemeDir, { recursive: true });
writeFileSync(join(schemeDir, UI_TESTS + '.xcscheme'), scheme);
console.log(`watch-ui-tests: cel ${UI_TESTS} i schemat gotowe (${projDirName})`);
