# 36 — Wycofanie subskrypcji, zmiana ceny, Family Sharing, wyróżnienie dotychczasowych płacących (wydanie 0.17)

Badacz merytoryczny, 12.10.2026. Źródła: dokumentacja Apple (App Store Connect Help, StoreKit, App Review Guidelines, Apple Developer News —
szczebel 4) i Apple Developer Forums (szczebel 5; oznaczono, czy odpowiada pracownik Apple). Przeczytane 12.10.2026. Kontekst: plan
subskrypcji rocznej z Family Sharing (docs/18-archiwum-do-11.10.md, 06.10.2026; docs/18-przekazanie.md).

## Wnioski

1. **„Remove from Sale” zatrzymuje nowe zakupy i odnowienia.** App Store Connect Help: przed wycofaniem subskrypcji zdjąć ją ze sprzedaży,
   „to stop additional sign-ups and renewals”. Dotychczasowi subskrybenci nie są obciążani ponownie; dostęp trwa do końca opłaconego okresu
   (Apple: obowiązek z Paid Apps Agreement — „full amount of content to eligible subscribers through the subscription duration”).
   Dwa dokumenty/wypowiedzi zgodne: Help Apple + pracownik Apple na forum („…continue to renew until they cancel or you remove your in-app
   purchase from sale”).
2. **Jak zakończyć (procedura Apple):** zdjąć ze sprzedaży; czas między zdjęciem a końcem usługi „equivalent to its duration”, minimum 31 dni;
   dla subskrypcji dłuższych niż miesiąc, jeśli nie da się zapewnić treści do końca okresu — kontakt z Apple; uprzedzić subskrybentów
   (e-mail, strona, komunikat w aplikacji) co najmniej 31 dni wcześniej; zakończyć promocje. Zmiany dostępności, które dotykają istniejących
   subskrybentów, może robić tylko Account Holder. **Dla subskrypcji rocznej:** usługa po zdjęciu ze sprzedaży musi trwać do roku (do końca
   ostatniego okresu). Przy przejściu na darmowy model ten warunek spełnia się sam — aplikacja dalej działa i daje wszystko bez opłaty.
3. **Usunięcie aplikacji ze sklepu ≠ zdjęcie subskrypcji ze sprzedaży.** Pracownik Apple (forum 700922): przy usuniętej aplikacji subskrypcja
   może zostać w sprzedaży i dalej się odnawiać. Zgodny raport użytkownika forum z VIII 2026 (wątek 125213): po usunięciu aplikacji subskrypcje
   nadal się odnawiały. **Wniosek praktyczny: przy przejściu na darmowe trzeba zdjąć ze sprzedaży samą subskrypcję**, inaczej ludzie płacą
   dalej za coś, co jest za darmo.
4. **Odwrotny wariant — zostawić subskrypcję w sprzedaży, ukryć w aplikacji** (żeby dotychczasowi dalej płacili): pracownik Apple potwierdza,
   że to technicznie działa. Ryzyko: wpis użytkownika forum z 2019 (wątek 125213) — aktualizacja odrzucona, bo recenzent nie znalazł sposobu
   zakupu (jedno źródło, szczebel 5). Przy darmowej aplikacji pobieranie opłaty za nic stoi też w sprzeczności z 3.1.2(a) („must provide
   ongoing value”) — **nasza interpretacja**. Nie rekomendowane.
5. **Zmiana ceny:**
   - obniżka: istniejące subskrypcje automatycznie odnawiają się po niższej cenie, wyższej nie da się zachować; obniżki nie da się cofnąć
     (można później zaplanować podwyżkę);
   - podwyżka: albo zachować starą cenę dla dotychczasowych (opcja „Keep the current price for existing subscribers”), albo objąć ich
     podwyżką — wtedy powiadomienie albo prośba o zgodę (zgoda m.in. gdy była podwyżka w ostatnich 12 mies.); brak zgody → subskrypcja
     wygasa na koniec okresu; podwyżki nie da się cofnąć;
   - **czy cena może wynosić 0** — w przeczytanych dokumentach brak; [OTWARTE] (nie jest drogą do „darmowej” wersji).
6. **Family Sharing jest nieodwracalny — POTWIERDZONE (dwa dokumenty Apple).** Po włączeniu dla zakupu w App Store Connect nie da się go
   wyłączyć; użytkownik może wyłączyć udostępnianie u siebie. Dotychczasowi subskrybenci (sprzed włączenia) muszą sami włączyć udostępnianie
   w ustawieniach subskrypcji; nowi — domyślnie wg swojego ustawienia. Obejście z forum (nowa subskrypcja bez Family Sharing) — nie
   sprawdzone w dokumentacji Apple [OTWARTE].
7. **Wyróżnienie dotychczasowych płacących po przejściu na darmowe:**
   - Apple wprost opisuje wzorzec dla zmiany modelu płatna aplikacja → darmowa z zakupami: sprawdzić `AppTransaction.originalAppVersion`
     i dalej dawać dotychczasowym klientom to, za co zapłacili. To oficjalne przyzwolenie na różne traktowanie wcześniejszych kupujących.
   - Dla przejścia subskrypcja → darmowe nie ma osobnego dokumentu. Historia transakcji `Transaction.all` obejmuje „Auto-renewable
     subscriptions, including all renewals”, więc da się rozpoznać byłych subskrybentów; **czy obejmuje subskrypcje wygasłe dawno temu —
     strona nie mówi wprost** [OTWARTE — test w sandboxie].
   - Wytyczne: 3.1.1 zabrania odblokowywania funkcji innymi mechanizmami niż zakup w aplikacji (klucze, kody QR itd.). Wyróżnienie oparte
     na wcześniejszym zakupie przez App Store nie jest „własnym mechanizmem” — **nasza interpretacja**, brak wprost zakazu ani zgody dla tego
     wariantu [OTWARTE]. Bezpieczny zakres: symboliczne wyróżnienie (podziękowanie, odznaka „wspierający”) bez blokowania czegokolwiek
     pozostałym; unikać obietnic przyszłych korzyści, których nie ma w opisie subskrypcji (3.1.2(c): jasno opisać, co użytkownik dostaje za cenę).

## Opcje dla scenariusza „przejście z płatnego na darmowe” (decyzja produktowa — właściciel)

| Opcja | Co się dzieje z subskrybentami | Kompromisy |
|---|---|---|
| A. Zdjąć subskrypcję ze sprzedaży + darmowa aplikacja + wyróżnienie byłych płacących | Odnowienia stop; każdy korzysta do końca okresu i dalej za darmo | Zgodne z procedurą Apple; wymaga uprzedzenia ≥ 31 dni; wyróżnienie zależne od [OTWARTE] o historii transakcji |
| B. Zostawić w sprzedaży, ukryć w aplikacji | Płacą dalej, aż sami anulują | Opisane przez pracownika Apple jako możliwe, ale ryzyko odrzucenia przy przeglądzie i sprzeczność z „ongoing value”; zła opinia użytkowników |
| C. Obniżyć cenę zamiast wycofać | Odnawiają się po niższej cenie automatycznie | Brak drogi do 0 zł w dokumentacji; obniżki nie da się cofnąć |

Rekomendacja badacza (od strony zgodności z zasadami): **A**.

## Źródła

Szczebel 4 (Apple):
- App Store Connect Help, „Set availability for an auto-renewable subscription” —
  https://developer.apple.com/help/app-store-connect/manage-subscriptions/set-availability-for-an-auto-renewable-subscription/
  (część „Removing a subscription from sale”): „Before discontinuing an auto-renewable subscription, remove it from sale, within App Store
  Connect, to stop additional sign-ups and renewals.”; „A minimum of 31 days is required from the date subscription is removed from sale and
  service is stopped to allow monthly and shorter duration subscriptions to expire.”
- Ta sama strona: „Keep in mind that you're required by the Paid Apps Agreement to provide the full amount of content to eligible subscribers
  through the subscription duration.”; „We recommend notifying them at least 31 days before discontinuing the subscription service.”
- App Store Connect Help, „Manage pricing for auto-renewable subscriptions” —
  https://developer.apple.com/help/app-store-connect/manage-subscriptions/manage-pricing-for-auto-renewable-subscriptions/
  („Decrease the price…”): „If you decrease the price of your auto-renewable subscription, existing subscriptions will automatically renew at
  the lower price. You don't have the option to preserve the higher price for existing subscribers.”; („Increase the price…”): „If a
  subscriber doesn't consent before the first renewal at the higher price, their subscription will expire at the end of the last renewal cycle
  at the former price.”
- App Store Connect Help, „Turn on Family Sharing for In-App Purchases” —
  https://developer.apple.com/help/app-store-connect/configure-in-app-purchase-settings/turn-on-family-sharing-for-in-app-purchases/:
  „Keep in mind that once you turn on Family Sharing for an In-App Purchases in App Store Connect, you can't turn it off.”; o istniejących:
  „Users must opt-in to Family Sharing from within their manage subscriptions page.”
- Apple Developer News, 15.02.2022, „Enable Family Sharing for your subscriptions” — https://developer.apple.com/news/?id=ksfkdwpr:
  „Please note that once you enable Family Sharing for a subscription, you won't be able to turn this feature off.”
- StoreKit, „Supporting business model changes by using the app transaction” —
  https://developer.apple.com/documentation/storekit/supporting-business-model-changes-by-using-the-app-transaction: „Then, use that
  information to determine your customers' entitlement to features that were available in the paid app.”
- StoreKit, `Transaction.all` — https://developer.apple.com/documentation/storekit/transaction/all (lista typów): „Auto-renewable
  subscriptions, including all renewals”.
- App Review Guidelines — https://developer.apple.com/app-store/review/guidelines/: 3.1.1 „Apps may not use their own mechanisms to unlock
  content or functionality, such as license keys, augmented reality markers, QR codes…”; 3.1.2(a) „If you offer an auto-renewable
  subscription, you must provide ongoing value to the customer…”; 3.1.2(c) „Before asking a customer to subscribe, you should clearly describe
  what the user will get for the price.”

Szczebel 5 (fora Apple):
- Wątek 700922 — https://developer.apple.com/forums/thread/700922, odpowiedź „App Store Commerce Engineer” (pracownik Apple): „…they can continue
  to renew until they cancel or you remove your in-app purchase from sale.”
- Wątek 125213 — https://developer.apple.com/forums/thread/125213 (użytkownicy, nie Apple): cytowany komunikat App Store Connect z 2019:
  „Existing subscribers won't be able to renew this subscription.”; wpis z 2019 o odrzuceniu aktualizacji z ukrytą subskrypcją; wpis z VIII
  2026 o odnowieniach po usunięciu aplikacji. Każdy — jedno źródło.
- Wątek 716346 — https://developer.apple.com/forums/thread/716346 (użytkownicy): cytat z dawnej pomocy App Store Connect, że po zdjęciu ze
  sprzedaży kupujący „can't restore it … or renew” — **sprzeczne** z odpowiedzią pracownika Apple w 700922 w części o przywracaniu
  (tam: aplikacja usunięta, zakup w sprzedaży). Część wspólna: zdjęcie *subskrypcji* ze sprzedaży kończy odnowienia.

## Otwarte pytania

- [OTWARTE] Czy po zdjęciu subskrypcji ze sprzedaży „Przywróć zakupy” i `currentEntitlements` dalej pokazują aktywny okres do jego końca —
  aktualna pomoc Apple tego nie mówi; stara pomoc (cytowana na forum) sugerowała brak przywracania. Test w sandboxie przed decyzją.
- [OTWARTE] Czy `Transaction.all` zwraca dawno wygasłe subskrypcje (potrzebne do wyróżnienia byłych płacących) — test w sandboxie.
- [OTWARTE] Czy wyróżnienie byłych subskrybentów po przejściu na darmowe ma jakąkolwiek wytyczną Apple — brak; interpretacja wyżej.
- [OTWARTE] Czy cena subskrypcji może wynosić 0 — brak w przeczytanych dokumentach.
- [OTWARTE] Zwroty dla subskrybentów rocznych przy wcześniejszym wyłączeniu usługi — tylko cytat dialogu z 2019 na forum („you allow Apple
  to refund…”); aktualna pomoc kieruje do kontaktu z Apple.
