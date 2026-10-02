/*
 * Link do rejestracji iPhone'a dla instalacji „ad hoc” (EAS internal distribution) — bez terminala u użytkownika.
 * Robi to samo co opcja „Website” w `eas device:create` (polecenie jest tylko interaktywne), na funkcjach z eas-cli
 * w wersji przypiętej w workflow (EAS_CLI). Wymaga: EXPO_TOKEN, EXPO_APPLE_TEAM_ID. Wypisuje adres do otwarcia na iPhonie.
 */
const path = require('path');
const B = path.join(path.dirname(require.resolve('eas-cli/package.json')), 'build') + '/';
const { createGraphqlClient } = require(B + 'commandUtils/context/contextUtils/createGraphqlClient');
const { UserQuery } = require(B + 'graphql/queries/UserQuery');
const { createOrGetExistingAppleTeamAndUpdateNameIfChangedAsync } = require(B + 'credentials/ios/api/GraphqlClient');
const { AppleDeviceRegistrationRequestMutation } = require(B + 'credentials/ios/api/graphql/mutations/AppleDeviceRegistrationRequestMutation');
const { getExpoWebsiteBaseUrl } = require(B + 'api');

(async () => {
  const token = process.env.EXPO_TOKEN, team = process.env.EXPO_APPLE_TEAM_ID;
  if (!token || !team) throw new Error('Brak sekretu EXPO_TOKEN albo APPLE_TEAM_ID w ustawieniach repozytorium.');
  const client = createGraphqlClient({ accessToken: token });
  const account = await UserQuery.requireCurrentUserPrimaryAccountAsync(client);
  const appleTeam = await createOrGetExistingAppleTeamAndUpdateNameIfChangedAsync(client, account.id, { appleTeamIdentifier: team });
  const req = await AppleDeviceRegistrationRequestMutation.createAppleDeviceRegistrationRequestAsync(client, appleTeam.id, account.id);
  console.log(new URL(`/register-device/${req.id}`, getExpoWebsiteBaseUrl()).toString());
})().catch(e => { console.error(e?.message ?? e); process.exit(1); });
