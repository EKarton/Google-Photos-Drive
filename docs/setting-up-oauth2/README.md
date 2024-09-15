# Setting up OAuth2 on Google

## Description

This document outlines how to create your own OAuth2 client ID and client secrets so that you can interact with the Google Photos APIs.

## Steps

1. Go to <https://cloud.google.com/cloud-console> and log into your Google account.
2. Click on the "Console" button:

    ![step-1](./images/step-1.png)

3. Click on the "Select Project" button and create a new project with any name:

    ![step-2](./images/step-2.png)

    ![step-3](./images/step-3.png)

    ![step-4](./images/step-4.png)

4. Wait for the project to be created. Then, select your project again:

    ![step-5](./images/step-5.png)

    ![step-6](./images/step-6.png)

5. Type in "Photos Library Api" in the search box, select "Photos Library Api", and click on "Enable":

    ![step-7](./images/step-7.png)

    ![step-8](./images/step-8.png)

6. Create a new OAuth2 Consent Screen by going to to the APIs and Services tab, selecting OAuth Consent Screen, creating an External API, and fill in the details:

    ![step-9](./images/step-9.png)

    ![step-10](./images/step-10.png)

    ![step-11](./images/step-11.png)

    ![step-12](./images/step-12.png)

7. We don't need special scopes. So we can click on the Save and Continue button in the special scopes page:

    ![step-13](./images/step-13.png)

8. In the Test Users page, click on Save and Continue. We don't need to add test users since we will publish the app:

    ![step-14](./images/step-14.png)

9. Now, publish the app:

    ![step-15](./images/step-15.png)

    ![step-16](./images/step-16.png)

10. Create the Client IDs and client secrets by going to the "Credentials" tab, clicking on "Create Credentials", select "OAuth Client ID", selecting "Web Application", and adding <http://localhost:4200/auth/login/callback> in the authorized redirect uri:

    ![step-17](./images/step-17.png)

    ![step-18](./images/step-18.png)

    ![step-19](./images/step-19.png)

    ![step-20](./images/step-20.png)

    ![step-21](./images/step-21.png)

11. Finally, click on the Create button. A dialog will appear with your Client ID and Client secrets. Copy the client ID and client secrets in a note pad.

    ![step-22](./images/step-22.png)
