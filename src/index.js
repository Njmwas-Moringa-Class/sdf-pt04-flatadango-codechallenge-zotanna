document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "http://localhost:3000";
  let availableTickets = 0;
  let filmData = {}; 

  const getAndDisplayMovies = async (filmsId) => {
    
  };

  const updateAvailableTickets = () => {
    document.getElementById("ticket-num").textContent = availableTickets;
  };

  const buyTicket = async () => {
    try {
      if (availableTickets > 0) {
        availableTickets -= 1;
        updateAvailableTickets();
        const ticketsSold = filmData.capacity - availableTickets;

        setTimeout(() => {
          filmData.tickets_sold = ticketsSold;
        }, 1000);

        if (availableTickets === 0) {
          const buyButton = document.getElementById("buy-ticket");
          buyButton.textContent = "Sold Out";
          document.querySelector(".film-item.selected").classList.add("sold-out");
        }
      }
    } catch (error) {
      console.error("Error purchasing ticket:", error);
    }
  };

  const populateMovieList = async () => {
    // ... (Existing populateMovieList code remains unchanged)
  };

  const handleFilmClick = async (film) => {
    getAndDisplayMovies(film.id);
    const selectedFilmItem = document.querySelector(".film-item.selected");
    if (selectedFilmItem) {
      selectedFilmItem.classList.remove("selected");
    }
    document.querySelector(`[data-film-id="${film.id}"]`).classList.add("selected");
  };

  const handleDeleteClick = async (film, li) => {
    try {
      const response = await fetch(`${BASE_URL}/films/${film.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        li.remove(); // Remove the film from the list on success
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const createFilmItem = (film) => {
    const li = document.createElement("li");
    li.textContent = film.title;
    li.classList.add("film-item");
    li.setAttribute("data-film-id", film.id);

    if (film.tickets_sold >= film.capacity) {
      li.classList.add("sold-out");
    }

    // Create a delete button and add a click event listener
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent film click event when clicking delete button
      handleDeleteClick(film, li);
    });

    li.appendChild(deleteButton);

    // Add a click event listener to the film item
    li.addEventListener("click", () => {
      handleFilmClick(film);
    });

    filmsList.appendChild(li);
  };

  const updateFilmList = (films) => {
    filmsList.innerHTML = ""; // Clear the film list
    films.forEach((film) => {
      createFilmItem(film);
    });
  };

  const placeholderLi = document.querySelector("#films > li");
  if (placeholderLi) {
    placeholderLi.remove();
  }

  const filmsList = document.getElementById("films");

  populateMovieList();

  const buyButton = document.getElementById("buy-ticket");
  buyButton.addEventListener("click", () => {
    buyTicket();
  });

  getAndDisplayMovies(1);
});

//document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "http://localhost:3000";

  let availableTickets = 0;

  const getAndDisplayMovies = async (filmsId) => {
    try {
      const response = await fetch(`${BASE_URL}/films/${filmsId}`);

      if (!response.ok) {
        throw Error("Failed to fetch movie details.");
      }

      const filmData = await response.json();
      const {
        title,
        runtime,
        showtime,
        capacity,
        tickets_sold,
        description,
        poster,
      } = filmData;

      availableTickets = capacity - tickets_sold;

      document.getElementById("poster").src = poster;
      document.getElementById("title").textContent = title;
      document.getElementById("runtime").textContent = `${runtime} minutes`;
      document.getElementById("showtime").textContent = showtime;
      document.getElementById("ticket-num").textContent = availableTickets;
      document.getElementById("film-info").textContent = description;
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const updateAvailableTickets = () => {
    document.getElementById("ticket-num").textContent = availableTickets;
  };

  const buyTicket = async () => {
    try {
      if (availableTickets > 0) {
        availableTickets -= 1;

        updateAvailableTickets();

        const ticketsSold = capacity - availableTickets;

        setTimeout(() => {
          filmData.tickets_sold = ticketsSold;
        }, 1000);
      }
    } catch (error) {
      console.error("Error purchasing ticket:", error);
    }
  };

  const populateMovieList = async () => {
    try {
      const filmsList = document.getElementById("films");

      const response = await fetch(`${BASE_URL}/films`);

      if (!response.ok) {
        throw new Error("Failed to fetch movie list.");
      }

      const films = await response.json();

      films.forEach((film) => {
        const li = document.createElement("li");
        li.textContent = film.title;
        li.classList.add("film-item");

        li.addEventListener("click", () => {
          getAndDisplayMovies(film.id);
        });

        filmsList.appendChild(li);
      });
    } catch (error) {
      console.error("Error fetching movie list:", error);
    }
  };

  const placeholderLi = document.querySelector("#films > li");
  if (placeholderLi) {
    placeholderLi.remove();
  }

  populateMovieList();

  const buyButton = document.getElementById("buy-ticket");
  buyButton.addEventListener("click", () => {
    buyTicket();
  });

  getAndDisplayMovies(1);
//});



