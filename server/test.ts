import admin from 'firebase-admin';


admin.initializeApp({
  credential: admin.credential.cert('annotext-4fa92-firebase-adminsdk-ks24q-96338efe3c.json')
});

const auth = admin.auth();

const token = "eyJuYW1lIjoiUmFhaGltIFNpZGRpcWkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSk5CNDdiSVZSVlUzTTA2aC1uZHlieFdKUDltOE5nTFV5ZjZnVWx3dENRPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2Fubm90ZXh0LTRmYTkyIiwiYXVkIjoiYW5ub3RleHQtNGZhOTIiLCJhdXRoX3RpbWUiOjE2OTk3MDU4MzAsInVzZXJfaWQiOiJYN1VhR2RWTmVrZnhGMml0RXhJNDhOQWZXemYyIiwic3ViIjoiWDdVYUdkVk5la2Z4RjJpdEV4STQ4TkFmV3pmMiIsImlhdCI6MTY5OTcwNTgzMCwiZXhwIjoxNjk5NzA5NDMwLCJlbWFpbCI6InN0b3JtY2xhdzExQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTE4MzU5NzU1MDcxOTAzMTE4MzUzIl0sImVtYWlsIjpbInN0b3JtY2xhdzExQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0";

auth.verifyIdToken(token)
    .then(user => {
        const { name, email, phone_number, uid } = user;
        console.log({ name, phone_number, uid, email });
});