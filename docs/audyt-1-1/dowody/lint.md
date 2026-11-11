# Dowód: lint (commit 79117f33, 11.11.2026)

```

> trening@1.0.1 lint
> eslint .


app/(tabs)/_layout.tsx
   3:24  warning  'lib/store.ts' imported multiple times  import/no-duplicates
  10:30  warning  'lib/store.ts' imported multiple times  import/no-duplicates

app/(tabs)/index.tsx
   2:22  warning  'node_modules/react-native/index.js' imported multiple times  import/no-duplicates
  11:23  warning  'node_modules/react-native/index.js' imported multiple times  import/no-duplicates
  20:10  warning  'firstSteps' is defined but never used                                           @typescript-eslint/no-unused-vars

app/(tabs)/more.tsx
  2:10  warning  'View' is defined but never used  @typescript-eslint/no-unused-vars

app/_layout.tsx
   5:52   warning  'node_modules/react-native/index.js' imported multiple times                           import/no-duplicates
   8:23   warning  'node_modules/react-native/index.js' imported multiple times                           import/no-duplicates
  17:26   warning  'node_modules/react-native/index.js' imported multiple times                           import/no-duplicates
  21:32   warning  'FW' is defined but never used                                                                            @typescript-eslint/no-unused-vars
  45:267  warning  React Hook useEffect has a missing dependency: 'start'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

app/exercise/[id].tsx
   4:49   warning  'node_modules/expo-router/build/index.js' imported multiple times  import/no-duplicates
   8:23   warning  'node_modules/expo-router/build/index.js' imported multiple times  import/no-duplicates
  12:31   warning  'lib/seed.ts' imported multiple times                              import/no-duplicates
  13:210  warning  'lib/seed.ts' imported multiple times                              import/no-duplicates

app/exercises.tsx
  6:29  warning  'Input' is defined but never used  @typescript-eslint/no-unused-vars

app/generator.tsx
  10:69   warning  'lib/store.ts' imported multiple times                                                  import/no-duplicates
  18:13   warning  'locale' is defined but never used                                                                         @typescript-eslint/no-unused-vars
  20:33   warning  'lib/store.ts' imported multiple times                                                  import/no-duplicates
  56:162  warning  React Hook useMemo has an unnecessary dependency: 'rev'. Either exclude it or remove the dependency array  react-hooks/exhaustive-deps

app/history/[id].tsx
   2:16  warning  'Alert' is defined but never used   @typescript-eslint/no-unused-vars
  10:96  warning  'isBW' is defined but never used    @typescript-eslint/no-unused-vars
  23:24  warning  'fmtNum' is defined but never used  @typescript-eslint/no-unused-vars

app/history/edit/[id].tsx
   5:43  warning  'Stack' is defined but never used         @typescript-eslint/no-unused-vars
  19:23  warning  'HeaderButton' is defined but never used  @typescript-eslint/no-unused-vars
  34:64  warning  'th' is assigned a value but never used   @typescript-eslint/no-unused-vars

app/more/bands.tsx
   2:16  warning  'Alert' is defined but never used          @typescript-eslint/no-unused-vars
   4:18  warning  'Input' is defined but never used          @typescript-eslint/no-unused-vars
   4:35  warning  'Btn' is defined but never used            @typescript-eslint/no-unused-vars
  19:66  warning  'once' is assigned a value but never used  @typescript-eslint/no-unused-vars

app/more/bodymass.tsx
  5:35  warning  'Input' is defined but never used  @typescript-eslint/no-unused-vars

app/more/import.tsx
  4:61  warning  'Input' is defined but never used  @typescript-eslint/no-unused-vars

app/more/location/[id].tsx
   2:16  warning  'Alert' is defined but never used      @typescript-eslint/no-unused-vars
  12:61  warning  'bandColor' is defined but never used  @typescript-eslint/no-unused-vars

app/pick-template.tsx
   1:17  warning  'useMemo' is defined but never used      @typescript-eslint/no-unused-vars
   2:10  warning  'Pressable' is defined but never used    @typescript-eslint/no-unused-vars
   3:10  warning  'Text' is defined but never used         @typescript-eslint/no-unused-vars
   6:20  warning  'F' is defined but never used            @typescript-eslint/no-unused-vars
   7:18  warning  'Input' is defined but never used        @typescript-eslint/no-unused-vars
   7:36  warning  'Muted' is defined but never used        @typescript-eslint/no-unused-vars
  11:23  warning  'lang' is defined but never used         @typescript-eslint/no-unused-vars
  22:20  warning  'th' is assigned a value but never used  @typescript-eslint/no-unused-vars

app/picker.tsx
   2:10   warning  'Pressable' is defined but never used                                                           @typescript-eslint/no-unused-vars
   3:10   warning  'Text' is defined but never used                                                                @typescript-eslint/no-unused-vars
   7:18   warning  'Input' is defined but never used                                                               @typescript-eslint/no-unused-vars
  17:35   warning  'hasReps' is defined but never used                                                             @typescript-eslint/no-unused-vars
  18:46   warning  'locale' is defined but never used                                                              @typescript-eslint/no-unused-vars
  18:60   warning  'lang' is defined but never used                                                                @typescript-eslint/no-unused-vars
  27:9    warning  'th' is assigned a value but never used                                                         @typescript-eslint/no-unused-vars
  50:105  warning  Unused eslint-disable directive (no problems were reported from 'react-hooks/exhaustive-deps')

app/plan.tsx
   3:35  warning  'node_modules/react-native/index.js' imported multiple times  import/no-duplicates
   5:40  warning  'node_modules/react-native/index.js' imported multiple times  import/no-duplicates
  15:13  warning  'locale' is defined but never used                                               @typescript-eslint/no-unused-vars

app/progression.tsx
  14:17  warning  'locale' is defined but never used  @typescript-eslint/no-unused-vars

app/reorder.tsx
  4:35  warning  'Empty' is defined but never used  @typescript-eslint/no-unused-vars

app/swap.tsx
   1:17  warning  'useMemo' is defined but never used      @typescript-eslint/no-unused-vars
   2:10  warning  'Pressable' is defined but never used    @typescript-eslint/no-unused-vars
   3:10  warning  'Text' is defined but never used         @typescript-eslint/no-unused-vars
   6:20  warning  'F' is defined but never used            @typescript-eslint/no-unused-vars
   7:58  warning  'Input' is defined but never used        @typescript-eslint/no-unused-vars
  16:46  warning  'locale' is defined but never used       @typescript-eslint/no-unused-vars
  16:60  warning  'lang' is defined but never used         @typescript-eslint/no-unused-vars
  31:9   warning  'th' is assigned a value but never used  @typescript-eslint/no-unused-vars

app/template/[id].tsx
  105:3   warning  React Hook useEffect contains a call to 'setOpen'. Without a list of dependencies, this can lead to an infinite chain of updates. To fix this, pass [tpl.items] as a second argument to the useEffect Hook  react-hooks/exhaustive-deps
  168:10  warning  'Col' is defined but never used                                                                                                                                                                             @typescript-eslint/no-unused-vars

app/templates.tsx
   2:22   warning  'node_modules/react-native/index.js' imported multiple times  import/no-duplicates
   6:27   warning  'node_modules/react-native/index.js' imported multiple times  import/no-duplicates
  16:132  warning  'once' is assigned a value but never used                                        @typescript-eslint/no-unused-vars

components/AddButton.tsx
  25:153  warning  React Hook useMemo has an unnecessary dependency: 'th'. Either exclude it or remove the dependency array  react-hooks/exhaustive-deps

components/DayPanel.tsx
   2:27  warning  'Alert' is defined but never used   @typescript-eslint/no-unused-vars
  11:13  warning  'locale' is defined but never used  @typescript-eslint/no-unused-vars

components/DeloadHint.tsx
  8:13  warning  'locale' is defined but never used  @typescript-eslint/no-unused-vars

components/OwnPlan.tsx
  11:13  warning  'locale' is defined but never used  @typescript-eslint/no-unused-vars

components/PeriodSummary.tsx
   6:21  warning  'locale' is defined but never used  @typescript-eslint/no-unused-vars
  10:10  warning  'Chip' is defined but never used    @typescript-eslint/no-unused-vars

components/Scroll.tsx
  12:13  warning  'ScrollView' is already defined   @typescript-eslint/no-redeclare
  17:13  warning  'FlatList' is already defined     @typescript-eslint/no-redeclare
  22:13  warning  'SectionList' is already defined  @typescript-eslint/no-redeclare

components/SwipeRow.tsx
  73:74  warning  Unused eslint-disable directive (no problems were reported from 'react-hooks/exhaustive-deps')

components/WhatsNew.tsx
  9:13  warning  'locale' is defined but never used  @typescript-eslint/no-unused-vars

docs/design/narzedzia/ikona.mjs
  34:3  warning  Unused eslint-disable directive (no problems were reported from 'import/no-unresolved')

docs/design/narzedzia/klatki-ruchu.mjs
  5:1  warning  Unused eslint-disable directive (no problems were reported from 'import/no-unresolved')

docs/design/narzedzia/warsztat.mjs
  32:3  warning  Unused eslint-disable directive (no problems were reported from 'import/no-unresolved')

docs/design/narzedzia/zrzuty.mjs
  2:1  warning  Unused eslint-disable directive (no problems were reported from 'import/no-unresolved')

lib/backup.ts
   5:178  warning  'flush' is defined but never used     @typescript-eslint/no-unused-vars
  10:58   warning  'Exercise' is defined but never used  @typescript-eslint/no-unused-vars
  10:73   warning  'WSet' is defined but never used      @typescript-eslint/no-unused-vars

lib/calendar.ts
  18:19  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports

lib/cues/index.ts
  31:1  warning  Unused eslint-disable directive (no problems were reported from '@typescript-eslint/no-var-requires')

lib/dashboard.ts
  1:54  warning  'isWorking' is defined but never used  @typescript-eslint/no-unused-vars
  1:65  warning  'exById' is defined but never used     @typescript-eslint/no-unused-vars
  2:65  warning  'plannedOn' is defined but never used  @typescript-eslint/no-unused-vars

lib/figures/index.ts
  15:1  warning  Unused eslint-disable directive (no problems were reported from '@typescript-eslint/no-var-requires')

lib/figures/v2/contract.ts
  12:1  warning  Import in body of module; reorder to top  import/first
  13:1  warning  Import in body of module; reorder to top  import/first
  14:1  warning  Import in body of module; reorder to top  import/first
  15:1  warning  Import in body of module; reorder to top  import/first
  17:1  warning  Import in body of module; reorder to top  import/first
  18:1  warning  Import in body of module; reorder to top  import/first
  19:1  warning  Import in body of module; reorder to top  import/first
  20:1  warning  Import in body of module; reorder to top  import/first
  21:1  warning  Import in body of module; reorder to top  import/first
  22:1  warning  Import in body of module; reorder to top  import/first

lib/figures/v2/figure.ts
   56:1  warning  Unused eslint-disable directive (no problems were reported from '@typescript-eslint/no-var-requires')
   68:1  warning  Unused eslint-disable directive (no problems were reported from '@typescript-eslint/no-var-requires')
  231:1  warning  Unused eslint-disable directive (no problems were reported from '@typescript-eslint/no-var-requires')

lib/figures/v2/overlayShapes.ts
  18:1  warning  Unused eslint-disable directive (no problems were reported from '@typescript-eslint/no-var-requires')

lib/figures/v2/rodziny/index.ts
   6:12  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
   7:9   warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
   8:12  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
   9:12  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  10:13  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  11:10  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  12:16  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  13:16  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  14:15  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  15:17  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  16:15  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  17:14  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  18:15  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  19:8   warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  20:14  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  21:19  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  22:8   warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  23:24  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  24:16  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  25:19  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  26:13  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  27:17  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  28:19  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  29:19  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  30:17  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  31:12  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  32:10  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  33:9   warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  34:15  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  35:18  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  36:14  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  37:14  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  38:19  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  39:15  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  40:16  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  41:18  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  42:10  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports

lib/figures/v2/ui.ts
  6:10  warning  't' is defined but never used  @typescript-eslint/no-unused-vars

lib/generator.ts
   4:21  warning  'LIB_BASE_NAMES' is defined but never used  @typescript-eslint/no-unused-vars
   7:23  warning  'locale' is defined but never used          @typescript-eslint/no-unused-vars
  12:1   warning  Import in body of module; reorder to top    import/first

lib/hkModule.ts
  34:16  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports

lib/i18n.ts
  69:5   warning  Unused eslint-disable directive (no problems were reported from '@typescript-eslint/no-var-requires')
  70:18  warning  A `require()` style import is forbidden                                                                @typescript-eslint/no-require-imports

lib/live.ts
   2:25   warning  'lang' is defined but never used          @typescript-eslint/no-unused-vars
   6:1    warning  Import in body of module; reorder to top  import/first
  40:144  warning  'si' is assigned a value but never used   @typescript-eslint/no-unused-vars

lib/locales/index.ts
  4:1  warning  Unused eslint-disable directive (no problems were reported from '@typescript-eslint/no-var-requires')

lib/motif.ts
  3:59  warning  'weekdayIdx' is defined but never used  @typescript-eslint/no-unused-vars

lib/plan.ts
  3:13  warning  'locale' is defined but never used  @typescript-eslint/no-unused-vars

lib/review-run.ts
  17:60  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports

lib/store-native.ts
  34:86  warning  A `require()` style import is forbidden  @typescript-eslint/no-require-imports

lib/swap.ts
  3:34  warning  'locale' is defined but never used  @typescript-eslint/no-unused-vars

✖ 160 problems (0 errors, 160 warnings)
  0 errors and 34 warnings potentially fixable with the `--fix` option.

kod wyjścia: 0
```
