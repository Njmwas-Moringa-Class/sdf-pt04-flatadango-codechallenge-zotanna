document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "http://localhost:3000";
  let numberOfTickets = 0;

  // Function to fetch movie details and update the UI
  const fetchAndDisplayMovieDetails = async (filmsId) => {
    try {
      const response = await fetch(`${BASE_URL}/films/${filmsId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch movie details.");
      }
      const filmInfo = await response.json();
      const {
        title,
        runtime,
        showtime,
        capacity,
        tickets_sold,
        description,
        poster,
      } = filmInfo;

      numberOfTickets = capacity - tickets_sold;

      // Update the DOM with movie details
      document.getElementById("title").textContent = title;
      document.getElementById("runtime").textContent = `${runtime} minutes`;
      document.getElementById("showtime").textContent = showtime;
      document.getElementById("ticket-num").textContent = numberOfTickets; // Update available tickets
      document.getElementById("film-info").textContent = description;
      document.getElementById("poster").src = poster;
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const updateRemainingTickets = () => {
    document.getElementById("ticket-num").textContent = numberOfTickets;
    // Update the number of available tickets in the DOM

    const buyButton = document.getElementById("buy-ticket");
    if (numberOfTickets === 0.1) {
      buyButton.disabled = true;
    } else {
      buyButton.disabled = false;
    }
  };

  const buyTicket = async () => {
    try {
      if (numberOfTickets > 0) {
        numberOfTickets -= 1;

        updateRemainingTickets();

        const newTicketsSold = capacity - numberOfTickets;

        setTimeout(() => {
          filmInfo.tickets_sold = newTicketsSold;
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
          fetchAndDisplayMovieDetails(film.id);
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

  fetchAndDisplayMovieDetails(1);
});
