# Google Photos Drive

[![Netlify Status](https://api.netlify.com/api/v1/badges/8f40be5e-e519-445d-acde-ab30d2209d7b/deploy-status)](https://app.netlify.com/sites/googlephotosdrive/deploys)

## Description

Do you have a lot of albums on Google Photos that is hard to search through? Wish you can view your albums like a directory? Now you can! With this web app, you can view your albums and photos like a directory!

If your albums are named with a `/` (like `Archives/Photos/2010`, `Archives/Photos/2009`), you can navigate through your albums like a directory, starting with `Archives` at the top, and drilling down to `2010` or `2009`.

## Features

- [x] View your albums like a directory
- [x] View all of your photos in an album
- [ ] Add new nested albums
- [ ] Rename existing albums
- [ ] Add photos to an album
- [ ] Remove photos from an album

## Walkthrough

Refer to this doc for a detailed walkthrough. However, here are a few screenshots:

![image-1](./docs/home/images/image-1.png)

![image-2](./docs/home/images/image-2.png)

![image-3](./docs/home/images/image-3.png)

## Setup / Getting Started

1. Install dependencies by running `npm install`

2. Next, create an OAuth2 client from Google Cloud for free by following the doc [here](./docs/setting-up-oauth2/README.md)

3. Then, create a `.env` file in the root of this project, and add your client ID, client secrets, and the client redirect uri the file like this:

    ```.env
    NG_APP_GOOGLE_CLIENT_ID=<Your Google OAuth2 Client ID>
    NG_APP_GOOGLE_CLIENT_SECRET=<Your Google OAuth2 Client Secret>
    NG_APP_GOOGLE_REDIRECT_URL=<Your Google OAuth2 Client Redirect Uri>
    ```

4. Finally, run `ng serve`. You can access the webpage at <http://localhost:4200>.

## Useful Scripts for Local Development

1. `ng serve`

    Run the app on dev mode (any changes to files will get updated automatically)

2. `ng generate`:

    Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

3. `ng build`:

    Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

4. `ng test --watch=false --no-progress --browsers=ChromeHeadless --code-coverage`:

    Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io) with code coverage and without a browser.

    To run only one test, use the `--src` flag. For instance, to run the `photos-section.component.spec.ts` test, run the following command:

    ```bash
    ng test --watch=false --no-progress --browsers=ChromeHeadless --code-coverage --src=src/app/pages/content-page/photos-section/__tests__/photos-section.component.spec.ts
    ```

## Usage

Please note that this project is used for educational purposes and is not intended to be used commercially. We are not liable for any damages/changes/lost data done by this project.

## Credits

Emilio Kartono, who made the entire project.

## License

This project is protected under the GNU licence. Please refer to the [LICENSE](./LICENSE) for more information.
