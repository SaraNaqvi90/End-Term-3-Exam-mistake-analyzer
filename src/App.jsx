import { useEffect, useState } from "react";

const QUOTE_API_URL = "https://dummyjson.com/quotes/random";
const LOCAL_STORAGE_KEY = "likedQuotes";
const FALLBACK_QUOTES = [
  {
    quote: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    quote: "The future depends on what you do today.",
    author: "Mahatma Gandhi"
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    quote: "Do something today that your future self will thank you for.",
    author: "Sean Patrick Flanery"
  },
  {
    quote: "It always seems impossible until it is done.",
    author: "Nelson Mandela"
  }
];

function App() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [likedQuotes, setLikedQuotes] = useState(() => {
    const savedLikes = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!savedLikes) {
      return [];
    }

    try {
      return JSON.parse(savedLikes);
    } catch (error) {
      return [];
    }
  });

  const showRandomFallbackQuote = () => {
    const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
    const randomQuote = FALLBACK_QUOTES[randomIndex];

    setQuote(randomQuote.quote);
    setAuthor(randomQuote.author);
    setStatusMessage("Showing an offline quote because the API is unavailable.");
  };

  const fetchQuote = async () => {
    setLoading(true);
    setStatusMessage("");

    try {
      const response = await fetch(QUOTE_API_URL);

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();

      setQuote(data.quote);
      setAuthor(data.author);
      setStatusMessage("");
    } catch (error) {
      showRandomFallbackQuote();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(likedQuotes));
  }, [likedQuotes]);

  const isCurrentQuoteLiked = likedQuotes.some(
    (likedQuote) =>
      likedQuote.quote === quote && likedQuote.author === author
  );

  const handleLikeToggle = () => {
    if (!quote || loading) {
      return;
    }

    if (isCurrentQuoteLiked) {
      const updatedLikes = likedQuotes.filter(
        (likedQuote) =>
          !(likedQuote.quote === quote && likedQuote.author === author)
      );
      setLikedQuotes(updatedLikes);
    } else {
      const newLikedQuote = { quote, author };
      setLikedQuotes([...likedQuotes, newLikedQuote]);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>Daily Motivation Dashboard</h1>

        <p className="liked-count">Total liked quotes: {likedQuotes.length}</p>

        {loading ? (
          <p>Loading quote...</p>
        ) : (
          <div className="quote-box">
            <p className="quote">"{quote}"</p>
            {author && <p className="author">- {author}</p>}
            {statusMessage && <p className="status-message">{statusMessage}</p>}
          </div>
        )}

        <div className="button-group">
          <button onClick={fetchQuote} disabled={loading}>
            {loading ? "Fetching..." : "New Quote"}
          </button>

          <button onClick={handleLikeToggle} disabled={loading || !quote}>
            {isCurrentQuoteLiked
              ? `Unlike ${"\u2764\uFE0F"}`
              : `Like ${"\u2764\uFE0F"}`}
          </button>
        </div>

        <div className="liked-section">
          <h2>Liked Quotes</h2>

          {likedQuotes.length === 0 ? (
            <p>No liked quotes yet.</p>
          ) : (
            <ul>
              {likedQuotes.map((likedQuote, index) => (
                <li key={`${likedQuote.quote}-${likedQuote.author}-${index}`}>
                  <span>"{likedQuote.quote}"</span>
                  {likedQuote.author && <span> - {likedQuote.author}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
