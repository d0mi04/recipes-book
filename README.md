
# 📚 Projekt: Książka kulinarna z wykorzystaniem MongoDB Atlas

Aplikacja backendowa służąca do zarządzania przepisami kulinarnymi, oparta o dokumentową bazę danych **MongoDB Atlas**, framework **Express.js** i język **JavaScript (Node.js)**. Projekt umożliwia dodawanie, pobieranie, wyszukiwanie oraz zarządzanie przepisami kulinarnymi przez REST API — z możliwością testowania w **Postmanie**.

---

## 🧠 Główne założenia projektu

- Każdy **przepis** to osobny dokument w kolekcji `przepisy`.
- Dane przechowywane są w **MongoDB w chmurze (Atlas)**.
- Backend napisany w **Node.js + Express.js**.
- Dane mogą być testowane za pomocą narzędzia **Postman**.
- Aplikacja może zostać rozszerzona o frontend (React) w przyszłości.

---

## 🗂️ Struktura projektu

```
├── models/
│   └── Przepis.js           # Model Mongoose dla kolekcji przepisów
├── routes/
│   └── przepisy.js          # Endpointy API dla operacji na przepisach
├── .env                     # Zmienna środowiskowa z connection stringiem do MongoDB
├── .gitignore
├── app.js                   # Główna logika serwera Express
├── package.json
└── README.md
```

---

## 🧾 Kolekcje w bazie danych

### 1. `przepisy`

Przechowuje dane dotyczące przepisów kulinarnych.

Przykładowy dokument:
```json
{
  "_id": "ObjectId",
  "tytul": "Zupa krem z dyni",
  "autor": "Anna Nowak",
  "czasPrzygotowania": "30 minut",
  "kategoria": "zupa",
  "skladniki": ["dynia", "cebula", "czosnek", "bulion"],
  "kroki": ["Pokrój dynię", "Podsmaż cebulę", "Gotuj razem"],
  "ocena": 4.5,
  "dataDodania": "2024-05-01T14:48:00.000Z"
}
```

Planowane kolekcje (rozszerzenie):
- `uzytkownicy`: rejestracja, logowanie, ulubione przepisy.
- `oceny`: osobne przechowywanie ocen użytkowników.

---

## 🚀 Jak uruchomić projekt lokalnie

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/twoj-uzytkownik/ksiazka-kulinarna.git
cd ksiazka-kulinarna
```

### 2. Instalacja zależności

```bash
npm install
```

### 3. Konfiguracja zmiennych środowiskowych

Utwórz plik `.env` w katalogu głównym i dodaj:

```
MONGODB_URI=mongodb+srv://<login>:<haslo>@<twoj-klaster>.mongodb.net/ksiazka_kulinarna?retryWrites=true&w=majority
PORT=3000
```

### 4. Uruchomienie serwera

```bash
node app.js
```

---

## 🧪 Testowanie w Postmanie

### 🔸 Endpointy API

| Metoda | Endpoint          | Opis                                 |
|--------|-------------------|--------------------------------------|
| GET    | /przepisy         | Pobierz wszystkie przepisy           |
| POST   | /przepisy         | Dodaj nowy przepis                   |
| GET    | /przepisy/:id     | Pobierz przepis po ID                |
| DELETE | /przepisy/:id     | Usuń przepis po ID                   |
| PUT    | /przepisy/:id     | Zaktualizuj przepis po ID           |

### 🔹 Przykład POST (dodanie przepisu)
W Postmanie:
- metoda: `POST`
- URL: `http://localhost:3000/przepisy`
- Body → `raw` → `JSON`:
```json
{
  "tytul": "Spaghetti Carbonara",
  "autor": "Jan Kowalski",
  "czasPrzygotowania": "20 minut",
  "kategoria": "obiad",
  "skladniki": ["makaron", "jajka", "boczek", "parmezan"],
  "kroki": ["Ugotuj makaron", "Podsmaż boczek", "Wymieszaj wszystko"],
  "ocena": 4.8,
  "dataDodania": "2025-05-10T12:00:00.000Z"
}
```

---

## 🔐 Bezpieczeństwo

- Dane do połączenia z bazą przechowywane są w `.env` (dodany do `.gitignore`).
- **Nigdy nie commituj pliku `.env`** ani danych uwierzytelniających.
- Można dodać middleware do walidacji danych (`express-validator`) i zabezpieczenia (`helmet`, `cors`) — gotowe do rozszerzenia.

---

## 📌 Wymagania

- Node.js 18+
- MongoDB Atlas (konto darmowe)
- Postman (do testów)

---

## 🛠️ Plany rozwoju

- 🔑 Autoryzacja i logowanie użytkowników (`JWT`)
- ⭐ Możliwość dodawania ulubionych przepisów
- 🔍 Wyszukiwanie przepisów po składnikach
- 💻 Frontend w React (opcjonalnie)
- 📈 System ocen użytkowników (oddzielna kolekcja)

---

## 🧑‍💻 Autor

Projekt stworzony w celach edukacyjnych.  
Chcesz współpracować lub masz pytania? Napisz do mnie!

---

## 📄 Licencja

Projekt dostępny na licencji MIT — używaj, modyfikuj i ucz się śmiało 😊
