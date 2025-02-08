
// Hilfsfunktionen zum Anzeigen und Verstecken von Bereichen
function showRegisterForm() {
    document.getElementById('register-form').classList.remove('hidden');
    document.getElementById('login-form').classList.add('hidden');
  }
  
  function showLoginForm() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
  }
  
  function showCreateForm() {
    document.getElementById('create-recipe-form').classList.toggle('hidden');
  }
  
  function searchRecipes() {
    document.getElementById('search-recipe-section').classList.toggle('hidden');
  }
  
  // Registrierung eines neuen Nutzers
  async function registerUser() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const passwort = document.getElementById('register-password').value;
    const passwortBestätigen = document.getElementById('register-password-confirm').value;
    if (!username || !email || !passwort ||!passwortBestätigen) {
      alert('Bitte füllen Sie alle Felder aus.');
      return;
    }
    if (passwort !== passwortBestätigen) {
      alert("Die Passwörter stimmen nicht überein. Bitte versuchen Sie es erneut.");
      return;
  }
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, passwort })
      });
  
      if (response.ok) {
        alert('Registrierung erfolgreich! Bitte melden Sie sich an.');
      } else {
        const errorData = await response.json();
        alert(`Registrierungsfehler: ${errorData.error}`);
      }
    } catch (error) {
      alert('Fehler bei der Registrierung: ' + error.message);
    }
  }

// Anmeldung eines Nutzers
async function loginUser() {
  const username = document.getElementById('login-username').value;
  const passwort = document.getElementById('login-password').value;

  if (!username || !passwort) {
    alert('Bitte füllen Sie alle Felder aus.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, passwort })
    });

    if (response.ok) {
      alert('Anmeldung erfolgreich!');
      document.getElementById('auth-section').classList.add('hidden');
      document.getElementById('dashboard-section').classList.remove('hidden');
    } else {
      const errorData = await response.json();
      alert(`Anmeldefehler: ${errorData.error}`);
    }
  }catch (error) {
    alert('Fehler bei der Anmeldung: ' + error.message);
  }
}

// Rezept erstellen
async function createRecipe() {
  const rezeptname = document.getElementById('rezepte-rezeptname').value;
  const beschreibung = document.getElementById('rezepte-beschreibung').value;
  const zutaten = document.getElementById('rezepte-zutaten').value;
  const zubereitung = document.getElementById('rezepte-zubereitung').value;
  const kategorie = document.getElementById('rezepte-kategorie').value;
  const land = document.getElementById('rezepte-land').value;

  if (!rezeptname || !beschreibung || !zutaten || !zubereitung || !kategorie || !land) {
    alert('Bitte füllen Sie alle Felder aus.');
    return;
  }
       
      const recipeData ={
        rezeptname: rezeptname,
        beschreibung: beschreibung,
        zutaten: zutaten.split('\n'),
        zubereitung: zubereitung.split('\n'),
        kategorie: kategorie,
        land: land
      };
  
    try {
      const response = await fetch('http://localhost:5000/api/rezepte', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recipeData)
      });

    if (response.ok) {
      alert('Rezept erfolgreich erstellt!');
    } else {
      alert('Fehler beim Erstellen des Rezepts');
    }
  } catch (error) {
    alert('Fehler: ' + error.message);
  }
}

// Rezepte anhand von Kriterien suchen
async function searchByCriteria() {
  const land = document.getElementById('search-land').value;
  const kategorie = document.getElementById('search-kategorie').value;
  let query = '';

  if (land) query += `land=${land}`;
  if (kategorie) query += `${query ? '&' : ''}kategorie=${kategorie}`;

  try {
    const response = await fetch(`http://localhost:5000/api/sucherezept${query ? '?' + query : ''}`);

    if (response.ok) {
      const rezepte= await response.json();
      displaySearchResults(rezepte);
    } else {
      alert('Fehler bei der Suche nach Rezepten');
    }
  } catch (error) {
    alert('Fehler: ' + error.message);
  }
}


async function displaySearchResults(recipes) {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = '';

  if (recipes.length === 0) {
    resultsContainer.innerHTML = '<p>Keine Rezepte gefunden.</p>';
    return;
  }

  recipes.forEach(rezepte => {
    const recipeDiv = document.createElement('div');
    recipeDiv.className = 'recipe-item';
    recipeDiv.innerHTML = `
      <h3>${rezepte.title || rezepte.rezeptname}</h3>
      <p>${rezepte.description || rezepte.beschreibung}</p>
      <p><strong>Zutaten:</strong> ${rezepte.zutaten || rezepte.zutaten}</p>
      <p><strong>Zubereitung:</strong> ${rezepte.zubereitung || rezepte.zubereitung}</p>
      <p><strong>Kategorie:</strong> ${rezepte.kategorie || rezepte.kategorie}</p>
      <p><strong>Land:</strong> ${rezepte.land || rezepte.land}</p>
      <button onclick="editRecipe('${rezepte.id}')">Bearbeiten</button>
      <button onclick="deleteRecipe('${rezepte.id}')">Löschen</button>
    `;
    resultsContainer.appendChild(recipeDiv);
  });
}

// Rezept löschen
async function deleteRecipe(recipeId) {
  if (!confirm('Möchtest du dieses Rezept wirklich löschen?')) return;

  try {
    const response = await fetch(`http://localhost:5000/api/rezepte/${recipeId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Rezept erfolgreich gelöscht!');
      searchByCriteria(); // Aktualisiere die Suchergebnisse
    } else {
      alert('Fehler beim Löschen des Rezepts');
    }
  } catch (error) {
    alert('Fehler: ' + error.message);
  }
}

// Rezept bearbeiten
async function editRecipe(rezepteId) {
  const newrezeptname = prompt('Neuen Rezepttitel eingeben:');
  const newbeschreibung = prompt('Neue Beschreibung eingeben:');
  const newzutaten = prompt('Neue Zutaten-liste eingeben:');
  const newzubereitung = prompt('Neue Zubereitung eingeben:');
  const newkategorie = prompt('Neue Kategorie eingeben:');
  const newland = prompt('Neues Herkunftsland eingeben:');

  if (!newrezeptname || !newbeschreibung) {
    alert('Titel und Beschreibung dürfen nicht leer sein.');
    return;
  }

  const updatedRecipe = {};
  if (newrezeptname) updatedRecipe.rezeptname = newrezeptname;
  if (newbeschreibung) updatedRecipe.beschreibung = newbeschreibung;
  if (newzutaten) updatedRecipe.zutaten = newzutaten;
  if (newzubereitung) updatedRecipe.zubereitung = newzubereitung;
  if (newkategorie) updatedRecipe.kategorie = newkategorie;
  if (newland) updatedRecipe.land = newland;

  try {
    const response = await fetch(`http://localhost:5000/api/rezepte/${rezepteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedRecipe),
    });

    if (response.ok) {
      alert('Rezept erfolgreich aktualisiert!');
      searchByCriteria();
    } else {
      const errorData = await response.json();
      alert(`Fehler beim Bearbeiten des Rezepts: ${errorData.message || 'Unbekannter Fehler'}`);
    }
  } catch (error) {
    alert('Fehler: ' + error.message);
  }
}
    async function logoutUser() {
  // Optionale Bestätigung
  if (!confirm('Möchtest du dich wirklich abmelden?')) return;

  // Entferne gespeicherte Authentifizierungsinformationen (z. B. aus dem LocalStorage)
  localStorage.removeItem('authToken');

  // Benutzerfeedback
  alert('Du wurdest erfolgreich abgemeldet.');
  const resultsContainer = document.getElementById('recipe-dashboard');
  if (resultsContainer) {
    resultsContainer.innerHTML = ''; // Inhalt löschen
    resultsContainer.style.display = 'none'; // Alternativ ausblenden
  }

  // Zurück zum Anmeldebereich navigieren
  document.getElementById('dashboard-section').classList.add('hidden');
  document.getElementById('auth-section').classList.remove('hidden');
}

let recipesVisible = false; // Status ob Rezepte sichtbar sind
//Alle Rezepte Aufrufen
async function loadAllRecipes() {
  const resultsContainer = document.getElementById('recipe-dashboard');

  // Lösche die Rezepte-Anzeige, wenn bereits Inhalte vorhanden sind
  if (recipesVisible) {
    resultsContainer.innerHTML = ''; // Inhalte löschen
    recipesVisible = false;
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/rezepte'); // API-Endpunkt für alle Rezepte
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Rezepte');
    }

    const recipes = await response.json();
    displayRecipes(recipes);
  } catch (error) {
    alert('Fehler: ' + error.message);
  }
}

// Funktion zum Anzeigen der Rezepte
function displayRecipes(recipes) {
  let resultsContainer = document.getElementById('recipe-dashboard');

  // Stelle sicher, dass der Container existiert
  if (!resultsContainer) {
    resultsContainer = document.createElement('div');
    resultsContainer.id = 'recipe-dashboard';
    document.body.appendChild(resultsContainer);
  }

  if (recipes.length === 0) {
    resultsContainer.innerHTML = '<p>Keine Rezepte gefunden.</p>';
    return;
  }

  // Erstelle und füge Rezeptkarten hinzu
  recipes.forEach(recipe => {
    const recipeDiv = document.createElement('div');
    recipeDiv.className = 'recipe-card';

    recipeDiv.innerHTML = `
      <h3>${recipe.rezeptname}</h3>
      <p>${recipe.beschreibung}</p>
      <p><strong>Zutaten:</strong> ${recipe.zutaten}</p>
      <p><strong>Zubereitung:</strong> ${recipe.zubereitung}</p>
      <p><strong>Kategorie:</strong> ${recipe.kategorie}</p>
      <p><strong>Land:</strong> ${recipe.land}</p>
    `;

    resultsContainer.appendChild(recipeDiv);
  });
}

// Füge Event-Listener für den Button hinzu
document.addEventListener('DOMContentLoaded', () => {
  const loadRecipesButton = document.querySelector('button[onclick="loadAllRecipes()"]');
  if (loadRecipesButton) {
    loadRecipesButton.addEventListener('click', loadAllRecipes);
  }
});

   

  