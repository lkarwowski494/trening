# Claude (Opus 5.5) na Vertex AI przy koncie Free Trial: fakty o platformie

Data: 26.10.2026. Szczebel 4: dokumentacja Google Cloud i Anthropic, strony przeczytane narzędziem WebFetch.
Uwaga: Google przeniosło dokumentację Vertex pod ścieżkę `docs.cloud.google.com/gemini-enterprise-agent-platform/...` (nazwa „Agent Platform”).

## 1. Czy kredyty Free Trial pokrywają Claude? Czy trzeba mieć konto płatne lub Marketplace? — NIE pokrywają (pewność wysoka)

- Strona Free Trial, sekcja „During the Free Trial”: "You can't access or use the $300 credit for a generative AI partner model that is offered as a managed API" (model jako usługa, „model as a service”). Ta sama sekcja: "While your billing account is a non-billable Free trial account, you can't do any of the following" — na liście są m.in. "Use Google Cloud Marketplace." i "Request a quota increase."
  https://docs.cloud.google.com/free/docs/free-cloud-features
- Ta sama strona, sekcja „When the Free Trial ends” (przejście na konto płatne) przywraca dostęp do usług, "such as GPUs, Google Cloud Marketplace, and third-party generative AI models."
- Włączenie modelu partnera wymaga roli IAM „Consumer Procurement Entitlement Manager” i zgody polityki organizacji na Cloud Commerce Consumer Procurement API (czyli mechanizmu Marketplace); trzeba też zaakceptować warunki: "If your Google Cloud billing account is managed by a prohibited reseller, you will be unable to accept the Terms of Service or enable Claude models."
  https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/use-partner-models (treść strony)
- Strona Claude: "To access a Claude on Google Cloud model, go to its Model Garden model card." Warunki są osobne: "Anthropic models are not a Google product".
  https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/claude
- Drugi wariant, „Anthropic managed”, rozlicza się przez zakup w Marketplace (wg strony: zakup produktu w Marketplace, rozliczenie z zobowiązania Google Cloud), więc na Free Trial też odpada.
  https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/claude/anthropic-managed

Wniosek: przy koncie Free Trial (bez przełączenia na płatne) Claude na Vertex jest niedostępny albo nie jest pokrywany kredytem. To, że model widać w Model Garden, nie oznacza, że da się go włączyć. Dokumentacja nie mówi wprost, czy przycisk „Enable” na Free Trial będzie zablokowany, czy da się go kliknąć, a opłata trafi poza kredyt. Wynika z niej tylko, że Marketplace jest zablokowany i kredyt nie obejmuje modeli partnerów.

## 2. Klucz API (express) czy konto usługi/OAuth? Regiony — wymagany OAuth/IAM (pewność wysoka)

- Express mode: "Only the models listed in the preceding table are supported in express mode." Tabela zawiera tylko modele Gemini (sekcja „Available models and rate limits in express mode”).
  https://docs.cloud.google.com/vertex-ai/generative-ai/docs/start/express-mode/overview
- Anthropic, sekcja „Before making API calls”: potrzebna rola IAM z uprawnieniem `aiplatform.endpoints.predict` (np. `roles/aiplatform.user`) i poświadczenia Google Cloud (`gcloud auth application-default login` lub `gcloud auth print-access-token`). Zapytania idą na `...:rawPredict` z nagłówkiem `Authorization: Bearer`.
  https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed
- W wariancie „Anthropic managed” strona Google mówi wprost: "No `x-api-key`" (tylko IAM).
- Regiony Opus 5.5 (strona modelu, tabela dostępności): „Multi-region” United States, „Multi-region” Europe oraz „global endpoint”. ID modelu: `claude-opus-5-5`.
  https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/claude/opus-5-5
- Anthropic: "Regional endpoints serve Claude Sonnet 4.6 and earlier models only."; "Multi-region and regional endpoints cost 10 percent more than global endpoints." (sekcja „Global, multi-region, and regional endpoints”).

## 3. Tryb batch, rabat, ceny — batch jest; rabat na Vertex [OTWARTE]

- Na Vertex nie działa Message Batches API Anthropic. Sekcja „Features not supported”: "API endpoints: Message Batches API, Models API, ...".
  https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed
- Zamiast niego jest własny tryb Google „Batch predictions”. Opus 5.5 jest na liście obsługiwanych modeli. Wejście to tabela BigQuery albo JSONL w Cloud Storage w formacie Anthropic. "The global endpoint for partner models isn't supported." Domyślnie "the number of concurrent batch requests that you can make in a single project is 4." Wyniki są dostępne "after all rows have completed or after 24 hours, whichever comes first."
  https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/claude/batch
  Batch na Vertex wymaga więc multi-regionu (us/eu, +10%) i dodatkowo BigQuery albo Cloud Storage.
- Rabat batch dla Claude na Vertex: strona batch o cenach nie mówi. Strona cennika Google (https://cloud.google.com/vertex-ai/generative-ai/pricing#claude-models) nie dała się odczytać narzędziem (treść ładowana skryptem). **[OTWARTE]**
- API Anthropic (sekcje „Model pricing” i „Batch processing”): Opus 5.5 kosztuje 4 USD/MTok za wejście, 20 USD/MTok za wyjście, 0,20 USD/MTok za odczyt z cache. Batch: "50 percent discount on both input and output tokens", czyli 2 / 10 USD/MTok.
  https://platform.claude.com/docs/en/about-claude/pricing
- Ceny Vertex: Anthropic odsyła do cennika Google. Wiadomo tylko, że multi-region i region kosztują +10% wobec global. Czy cena global na Vertex równa się cenie API Anthropic — **[OTWARTE]**.

## 4. Domyślne limity — liczby są, ale Free Trial nie może prosić o zwiększenie (pewność średnia)

- Strona Opus 5.5, „Shared Model Lineage Quota”: multi-region (US, EU) to QPM 1 000, wejście 10 mln TPM, wyjście 1 mln TPM; endpoint global to QPM 2 000, 20 mln / 2 mln TPM.
- Strona limitów: "the maximum quotas might vary by account and, in some cases, access might be restricted." Nie mówi, czy nowy projekt dostaje limit od razu, czy ma 0.
  https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/claude/quotas
- Free Trial: "Request a quota increase" jest na liście zakazanych działań (patrz pkt 1). Faktyczny limit dla tego projektu — **[OTWARTE]**.

## 5. Ograniczenia dla Polski/UE — brak przeszkody w dokumentacji (pewność średnio-wysoka)

- Polska jest na liście Anthropic "Countries and regions where we currently offer access to our products and services", która obejmuje też API. https://www.anthropic.com/supported-countries
- Opus 5.5 ma multi-region Europe (`eu`, host `aiplatform.eu.rep.googleapis.com`). Ruch zostaje w UE, za +10% wobec global.
- Ograniczenia krajowe Model Garden dla partnerów nie znalazłem w przeczytanych stronach. Blokadą jest typ konta (Free Trial), nie kraj.

## Kroki weryfikacji bez wydawania pieniędzy

1. Konsola → Model Garden → karta Claude Opus 5.5 → „Enable”. Oczekiwane: blokada z prośbą o przejście na konto płatne. Niczego nie przełączać ani nie akceptować upgrade’u.
2. Konsola → IAM i administracja → Limity → filtr „anthropic” / „claude” lub `aiplatform.googleapis.com` — sprawdzić, czy limity dla projektu wynoszą 0.
3. Cennik: otworzyć w przeglądarce https://cloud.google.com/vertex-ai/generative-ai/pricing#claude-models i odczytać ceny Opus 5.5 (global / multi-region / batch). Samo czytanie nic nie kosztuje.
4. Nie wysyłać zapytań testowych do Claude na tym projekcie: według strony Free Trial nie pokryje ich kredyt.

## Wniosek praktyczny

Kredyt Free Trial (300 USD) nie pokrywa Claude na Vertex, a samo konto Free Trial blokuje Marketplace i zwiększanie limitów. Bez przełączenia na płatne (zakazane) przekład przez Claude zostaje na API Anthropic (Message Batches, −50%). Kredyt Google da się użyć tylko na modele Gemini na Vertex (poza AI Studio: "The $300 credit can't pay for Gemini API in AI Studio costs.").
