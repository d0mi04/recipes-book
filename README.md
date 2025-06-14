
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

##  🔥 Główne funkcjonalności projektu

- 🗂️ Rejestracja i logowanie.
  - bezpieczne logowanie z wykorzystaniem JWT i hashowaniem haseł
- 🍟 Zarządzanie przepisami:
  - dodawaie, erdytowanie i usuwanie własnych przepisów
  - każdy przepis zawiera tytuł, opis, listę składników instrukcje i autora
- ⭐ Dodatkowe usprawnienia:
  - możliwość wystawienia przepisowi oceny oraz komentarza
  - lista ulubionych przepisów 
  - automatyczne czyszczenie danych np. po usunięciu przepisu - usuwane są też oceny i powiązania z ulubionymi.
- 🔍 wyszukiwanie i filtrowanie:
  - filtrowanie przepisów ze względu na składnik

## 🗂️ Struktura projektu

```
├── middleware/
│   └── authMiddleware.js    # zawiera funkcje sprawdzenia tokenu
├── models/
│   └── Przepis.js           # Model Mongoose dla kolekcji przepisów
│   └── Ocena.js 
│   └── Uzytkownik.js 
├── routes/
│   └── auth.js              # endpointy związane z autoryzacją i logowaniem użytkownika
│   └── przepisy.js          # Endpointy API dla operacji na przepisach
│   └── oceny.js 
│   └── uzytkownik.js 
├── .env                     # zawiera zmienne środowiskowe do logowania do MongoDB oraz wartość secret dla JWT
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
  "autor": "Uzytkownik.ObjectId",
  "czas": 30,
  "kategoria": "zupa",
  "skladniki": ["dynia", "cebula", "czosnek", "bulion"],
  "kroki": ["Pokrój dynię", "Podsmaż cebulę", "Gotuj razem"],
  "dataDodania": "Date.now"
}
```

### 2. `uzytkownicy`

Przechowuje dane dotyczące użytkowników.

Przykładowy dokument:
```json
{
  "_id": "ObjectId",
  "username": "user1",
  "email": "user@example.com",
  "password": "hasshedPassword",
  "favouriteRecipes": [
      {"Przepis.ObjectId"},
  ],
  "myRecipes": [
      {"Przepis.ObjectId"},
  ],
}
```

### 3. `oceny`

Przechowuje dane dotyczące ocen przepisów.

Przykładowy dokument:
```json
{
  "_id": "ObjectId",
  "przepisID": "Przepis.ObjectId",
  "userId": "Uzytkownik.ObjectId",
  "ocena": 5,
  "komentarz": "Recipes.ObjectId",
  "data": "Date.now"
}
```

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

### 🔸 Endpointy API - Kolekcja Autoryzacja

| Metoda | Endpoint          | Opis                                 |
|--------|-------------------|--------------------------------------|
| POST    | /auth/register         | Stwórz konto użytkownika           |
| POST   | /auth/login         | Zaloguj się na istniejące konto                   |

### 🔸 Endpointy API - Kolekcja Użytkownik

| Metoda | Endpoint          | Opis                                 |
|--------|-------------------|--------------------------------------|
| GET    | /uzytkownik/moje-przepisy         | Pobierz wszystkie przepisy, których autorem jest zalogowany użytkownik           |
| GET   | /uzytkownik/ulubione         | DPobierz wszystkie przepisy, które zalogowany uzytkownik dodał na jego listę favouriteRecipes                   |
| POST    | /uzytkownik/ulubione     | Dodaj przepis na listę favouriteRecipes                |
| DELETE    | /uzytkownik/ulubione/:przepisID         | Usuń przepis z listy favouriteRecipes aktualnie zalogowanego użytkownika           |

### 🔸 Endpointy API - Kolekcja Przepisy

| Metoda | Endpoint          | Opis                                 |
|--------|-------------------|--------------------------------------|
| GET    | /przepisy         | Pobierz wszystkie przepisy           |
| GET   | /przepisy?skladnik         | Pobierz wszystkie przepisy zawierające dany składnik                   |
| GET    | /przepisy/:przepisID     | Pobierz konkretny przepis                |
| POST    | /przepisy     | Dodaj nowy przepis                |
| PUT    | /przepisy/:przepisyID     | Zaktualizuj konkretny przepis           |
| DELETE | /przepisy/:ID     | Usuń przepis po ID                   |

### 🔸 Endpointy API - Kolekcja Oceny

| Metoda | Endpoint          | Opis                                 |
|--------|-------------------|--------------------------------------|
| GET    | /oceny/moje-oceny         | Pobierz wszystkie oceny jakie kiedykolwiek wystawił użytkownik           |
| GET   | /oceny/:przepisID         | wWświetl wszystkie oceny dla konkretnego przepisu                   |
| POST    | /oceny/:przepisID     | Wystaw ocenę dla konkretnego przepisu                |
| PUT    | /oceny/:przepisID         | Edytuj ocenę aktualnie zalogowanego użytkownika, którą wystawił konkretnemu przepisowi           |
| DELETE   | /oceny/:przepisID         | Usuń ocenę aktualnie zalogowanego użytkownika dl akonkretnego przepisu                   |

### 🔹 Przykład POST (dodanie przepisu)
W Postmanie:
- metoda: `POST`
- URL: `http://localhost:3000/przepisy`
- Body → `raw` → `JSON`:
```json
{
  "tytul": "Spaghetti Carbonara"
  "czas": 20,
  "kategoria": "obiad",
  "skladniki": ["makaron", "jajka", "boczek", "parmezan"],
  "kroki": ["Ugotuj makaron", "Podsmaż boczek", "Wymieszaj wszystko"]
}
```

---

## 🔐 Bezpieczeństwo

- Dane do połączenia z bazą przechowywane są w `.env` (dodany do `.gitignore`).

---

## 📌 Wymagania

- Node.js 18+
- MongoDB Atlas (konto darmowe)
- Postman (do testów)

---

## 🛠️ Plany rozwoju

- 🔑✅ (done) Autoryzacja i logowanie użytkowników
- ⭐✅ (done) Możliwość dodawania ulubionych przepisów
- 🔍✅ (done) Wyszukiwanie przepisów po składnikach 
- 💻⏳ Frontend w React
- 📈✅ (done) System ocen użytkowników
- 🧠⏳ ulepszenia w działaniu logiki aplikacji
---

## 🧑‍💻 Autorzy

Projekt stworzony w celach edukacyjnych. 

---

## 📄 Licencja

Projekt dostępny na licencji MIT 😊
