# GallerMe

Link to website: [https://gallerme.github.io/#/](https://gallerme.github.io/#/)

Made by Jack Nolan
- For database: team `Final Project 24`.
- For webdev: team `Final Project 26`.

### Brief Description

This website allows users to create and share pixel art with other users.
Once signed in, you can create art, and save colors that you like or think you may want to use again in new pixel arts.

The goal here was to create an easy and intuitive way to create pixel art and save it in a public space. The website should be fun and satisfying to use, and may be a good source of inspiration for finding some interesting images.

### Data model description

UML diagram can be seen [here](https://github.com/JackNolanDev/gallerme-backend/blob/master/database/Gallerme%20diagram%20reified%20postgresql.pdf).

The `user` data model contains information about our users.
- Password are stored salted and hashed instead of in paintext.
- The `first_name` and `last_name` fields aren't required by users when they log in if they care about their privacy. However, if they do enter them, then they will be shown.
- The `date_of_birth` field also isn't necessary and isn't shown to other users for security reasons. Beyond being a required field from the project description, this isn't a super helpful field.
- The `role` field is a portable enum that can only have the values `USER` or `ADMIN` because of the foreign key on the column pointing to the `role` table. Users can only do things that effect their own account, while Admins can update or delete anyone's account.

The `art` data model contains information about the pixel arts that can be made by users.
- We maintain a foreign key to the user who made the art.
- They can be named anything the user wants. This can be used when searching for a pixel art on the explore page.
- The size and data fields are currently immutable because they are used to render the image by arranging a grid of colored divs. The data in the `data` column is slighly compressed, but could probably be compressed further to make the system more efficient.

The `colors` data model contains information about colors saved during the creation process of making a pixel art.
- We maintain a foreign key to the user who saved the color.
- The user can name the color whatever they want which can make it easier to find / use in future artworks, or can be searched up by other users.
- The color is the hexidecimal representation of the color.

There is a many to many relationship between the `art` and `colors` data models because each piece of art may have many colors, and each color may be used in multiple pieces of art. This connection is maintained by the `color_art_index` table.

The easiest way to view the full relationships of the data models is on the [admin pages](https://gallerme.github.io/#/admin). However, these pages are only available to admins. If you want to see the admin pages, contact me and I can make you an admin briefly using the admin pages myself. On the admin pages, there are distinct pages for listing all the art / colors / users and the pages for creating new / editing / deleting old data objects.

---

### Steps for running locally

1. Setup your postgres database locally. The name of the database should be `gallerme`.
2. Import the schema and sample data from the dump in the database folder.
3. Start the server using `node server.js` which will get the server running on port 5000.
4. Start the [frontend](https://github.com/JackNolanDev/gallerme-frontend) server using `yarn serve`.
