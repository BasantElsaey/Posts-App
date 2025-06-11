# Zag's Blog 🌟

A modern, user-friendly blogging platform built with React, Vite, and Tailwind CSS. Users can create, edit, and delete their own posts, explore posts by category, like and comment on posts, and share them on social media. The app features a responsive design, dark mode, and image uploads via ImgBB.

## Features 🚀
- User Authentication: Sign up, log in, and log out securely.

- Post Management: Create, edit, and delete your own posts with title, description, category, and image.

- Categories: Browse posts by categories (Travel, Tech, Lifestyle, Food).

- Search & Filter: Search posts by title/description and filter by category or author.

- Likes & Comments: Like posts and add comments (authenticated users only).

- Social Sharing: Share posts on Twitter and Facebook.

- Profile Management: Update username, email, and password, and view your posts.

- Responsive Design: Works seamlessly on desktop and mobile.

- Dark Mode: Toggle between light and dark themes.

- Image Uploads: Upload post images via ImgBB API.

- Infinite Scroll: Load more posts as you scroll.

## Tech Stack 🛠️

- Frontend: React, Vite, Tailwind CSS, DaisyUI

- State Management: React Context API

- Form Handling: Formik, Yup for validation

- API: Axios for HTTP requests

- Backend: JSON Server (mock API)

- Notifications: React Toastify

- Image Upload: ImgBB API

- Date Formatting: Moment.js

- Avatars: DiceBear API

## Prerequisites 📋
- Node.js (v18 or higher)

- npm or Yarn

- ImgBB API key (sign up at ImgBB to get one)

- Git (optional, for cloning the repository)

### Installation 🧑‍💻
```bash
Clone the Repository (or download the code):
git clone https://github.com/your-username/zags-blog.git
cd zags-blog
```


### Install Dependencies:
```bash
npm install
```


## Set Up Environment Variables:
- Create a .env file in the root directory and add your ImgBB API key:
- VITE_IMGBB_API_KEY=your-imgbb-api-key


## Set Up JSON Server:

- Install JSON Server globally (if not already installed):npm install -g json-server


- Create a db.json file in the root directory with the following structure:
```bash
{
  "users": [],
  "posts": [],
  "login": {
    "route": "/login",
    "method": "POST",
    "handler": {
      "type": "db",
      "collection": "users",
      "filter": {
        "email": "{{request.body.email}}",
        "password": "{{request.body.password}}"
      },
      "response": {
        "user": "{{result.0}}",
        "token": "fake-token-{{result.0.id}}"
      }
    }
  }
}
```

- Start JSON Server:npx json-server --watch db.json --port 3000

### Run the Development Server:
```bash
npm run dev
Open http://localhost:5173 in your browser.
```

## Usage 📖

- Sign Up: Create an account via the Signup page.

- Log In: Log in with your credentials.

- Create a Post: Click the "+" button (bottom-right) to add a new post with a title, description, category, and image.

- Edit/Delete Posts: On your Profile page or post details, edit or delete your own posts.

- Explore Posts: Use the search bar, category buttons, or author filter on the Home page to find posts.

- Like & Comment: Like posts or add comments (requires login).

- Share Posts: Share posts on Twitter or Facebook via the share buttons.

- Update Profile: Go to your Profile page to update your username, email, or password.

- Toggle Dark Mode: Use the sun/moon icon in the navbar to switch themes.

## Project Structure 📂
```bash
├── public
├── src
|   ├── assets
|   |    ├── react.svg
│   ├── components
│   │   ├── AddEditPost.jsx
│   │   ├── Categories.jsx
│   │   ├── Hero.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Navbar.jsx
│   │   ├── PostDetails.jsx
│   │   ├── Profile.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Signup.jsx
|   |   ├── Footer.jsx
│   ├── contexts
│   │   ├── AuthContext.jsx
│   ├── services
│   │   ├── api.js
|   ├── App.css
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
├── .env
├── .gitignore
├── cors.js
├── db.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── vite.config.js
```

### Deployment 🚀
To deploy the app (e.g., to Netlify or Vercel):
```bash
Build the project:npm run build
```
- Deploy the dist folder to your hosting platform.

- Host the JSON Server separately (e.g., on Heroku or Render) or replace it with a real backend.

- Update the API base URL in src/services/api.js to point to your hosted backend.

## Contributing 🤝

- Fork the repository.

- Create a new branch (git checkout -b feature/your-feature).

- Make your changes and commit (git commit -m "Add your feature").

- Push to the branch (git push origin feature/your-feature).

- Open a Pull Request.

## License 📜
This project is licensed under the MIT License.
Contact 📧
For questions or feedback, reach out to your-email@example.com.

#### Happy blogging! 🌟
