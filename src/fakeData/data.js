const bookData = [
  {
    id: 1,
    name: "The Midnight Library",
    category: "Fiction",
    price: 14.99,
    originalPrice: 19.99,
    image: "https://images-na.ssl-images-amazon.com/images/I/81YzHKeWq7L.jpg",
    rating: 4.8,
    trending: "yes",
    discount: 25,
    description: "Between life and death there is a library. When Nora Seed finds herself in the Midnight Library, she has a chance to make things right. Up until now, her life has been full of misery and regret."
  },
  {
    id: 2,
    name: "Atomic Habits",
    category: "Self-Help",
    price: 11.99,
    originalPrice: 16.99,
    image: "https://images-na.ssl-images-amazon.com/images/I/81wgcld4wxL.jpg",
    rating: 4.9,
    trending: "yes",
    description: "No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master tiny behaviors that lead to remarkable results."
  },
  {
    id: 3,
    name: "The Silent Patient",
    category: "Thriller",
    price: 12.99,
    originalPrice: 17.99,
    image: "https://images-na.ssl-images-amazon.com/images/I/81hyQNK7SJL.jpg",
    rating: 4.7,
    trending: "yes",
    discount: 15,
    description: "Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in one of London's most desirable areas. One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word."
  },
  {
    id: 4,
    name: "Educated",
    category: "Memoir",
    price: 13.99,
    originalPrice: 18.99,
    image: "https://images-na.ssl-images-amazon.com/images/I/81NwOj14S6L.jpg",
    rating: 4.6,
    trending: "no",
    description: "Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom. Her family was so isolated from mainstream society that there was no one to ensure the children received an education, and no one to intervene when one of Tara's older brothers became violent."
  },
  {
    id: 5,
    name: "Clean Code",
    category: "Programming",
    price: 29.99,
    originalPrice: 39.99,
    image: "https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg",
    rating: 4.8,
    trending: "yes",
    discount: 20,
    description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn't have to be that way."
  },
  {
    id: 6,
    name: "Where the Crawdads Sing",
    category: "Fiction",
    price: 12.99,
    originalPrice: 16.99,
    image: "https://images-na.ssl-images-amazon.com/images/I/81O1oy0y9eL.jpg",
    rating: 4.9,
    trending: "no",
    description: "For years, rumors of the 'Marsh Girl' have haunted Barkley Cove, a quiet town on the North Carolina coast. So in late 1969, when handsome Chase Andrews is found dead, the locals immediately suspect Kya Clark, the so-called Marsh Girl. But Kya is not what they say."
  },
  {
    id: 7,
    name: "The 48 Laws of Power",
    category: "Self-Help",
    price: 15.99,
    originalPrice: 20.99,
    image: "https://images-na.ssl-images-amazon.com/images/I/71aG+xDKSYL.jpg",
    rating: 4.6,
    trending: "no",
    description: "In the book that People magazine proclaimed \"beguiling\" and \"fascinating,\" Robert Greene and Joost Elffers have distilled three thousand years of the history of power into 48 essential laws by drawing from the philosophies of Machiavelli, Sun Tzu, and Carl Von Clausewitz and also from the lives of figures ranging from Henry Kissinger to P.T. Barnum."
  },
  {
    id: 8,
    name: "The Pragmatic Programmer",
    category: "Programming",
    price: 31.99,
    originalPrice: 49.99,
    image: "https://images-na.ssl-images-amazon.com/images/I/51cUVaBWZzL._SX380_BO1,204,203,200_.jpg",
    rating: 4.8,
    trending: "yes",
    discount: 30,
    description: "Straight from the programming trenches, The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process—taking a requirement and producing working, maintainable code that delights its users."
  },
  {
    id: 9,
    name: "Becoming",
    category: "Memoir",
    price: 14.99,
    originalPrice: 19.99,
    image: "https://images-na.ssl-images-amazon.com/images/I/81dDwAzxtrL.jpg",
    rating: 4.9,
    trending: "no",
    description: "In a life filled with meaning and accomplishment, Michelle Obama has emerged as one of the most iconic and compelling women of our era. As First Lady of the United States of America—the first African American to serve in that role—she helped create the most welcoming and inclusive White House in history."
  },
  {
    id: 10,
    name: "The Girl on the Train",
    category: "Thriller",
    price: 10.99,
    originalPrice: 15.99,
    image: "https://images-na.ssl-images-amazon.com/images/I/81lbfKVZxCL.jpg",
    rating: 4.5,
    trending: "no",
    description: "Rachel catches the same commuter train every morning. She knows it will wait at the same signal each time, overlooking a row of back gardens. She's even started to feel like she knows the people who live in one of the houses. 'Jess and Jason', she calls them. Their life – as she sees it – is perfect. If only Rachel could be that happy."
  },
  {
    id: 11,
    name: "To Kill a Mockingbird",
    category: "Classic",
    price: 9.99,
    originalPrice: 12.99,
    image: "https://images-na.ssl-images-amazon.com/images/I/81aY1lxk+9L.jpg",
    rating: 4.9,
    trending: "no",
    description: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it, To Kill A Mockingbird became both an instant bestseller and a critical success when it was first published in 1960. It went on to win the Pulitzer Prize in 1961 and was later made into an Academy Award-winning film."
  },
  {
    id: 12,
    name: "Pride and Prejudice",
    category: "Classic",
    price: 8.99,
    originalPrice: 11.99,
    image: "https://images-na.ssl-images-amazon.com/images/I/71Q1tPupKjL.jpg",
    rating: 4.8,
    trending: "no",
    description: "Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language. Jane Austen called this brilliant work 'her own darling child' and its vivacious heroine, Elizabeth Bennet, 'as delightful a creature as ever appeared in print.'"
  }
];

export default bookData; 