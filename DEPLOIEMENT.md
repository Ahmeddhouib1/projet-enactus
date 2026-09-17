# Hébergement gratuit — Enactus ENSI

Configuration préparée. Le dépôt GitHub est en place (`origin` configuré, code à jour). Les étapes de connexion aux tableaux de bord Render/Neon/Vercel restent à finaliser manuellement : aucun outil de ce projet ne peut se connecter à ces interfaces à ta place.

## Services

- Frontend Next.js : Vercel Hobby, sous réserve d'éligibilité à son usage personnel non commercial.
- API Java : Render Free, avec le fichier `render.yaml` à la racine.
- PostgreSQL : Neon Free. Ne pas utiliser la base gratuite Render pour une installation durable : elle expire après 30 jours.

Les offres gratuites ont des quotas. Choisir explicitement les formules gratuites et ne pas activer d'offre payante. Le sous-domaine fourni suffit ; aucun domaine à acheter.

## 1. Dépôt GitHub

Créer un dépôt privé et y envoyer les sources. Ne jamais ajouter `.env`, les fichiers téléversés, `node_modules` ou les dossiers de compilation. Fait : `origin` pointe vers https://github.com/Ahmeddhouib1/projet-enactus et le code est à jour.

## 2. Base Neon

Créer un projet Free en région européenne, puis récupérer l'hôte, le nom de base, l'utilisateur et le mot de passe dans Connect. Utiliser de préférence l'hôte direct pour les migrations Flyway.

Dans Render, renseigner séparément :

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://ep-blue-moon-b428jn5b-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require
DB_USERNAME=UTILISATEUR_NEON
DB_PASSWORD=MOT_DE_PASSE_NEON
```

Ne pas coller une URL `postgresql://utilisateur:motdepasse@...` dans le champ JDBC. Spring Boot accepte directement `SPRING_DATASOURCE_URL`, qui remplace la configuration locale sans modification du code.

Une nouvelle base reçoit les migrations et données initiales du projet. Les données et fichiers de l'installation locale ne sont pas transférés automatiquement ; prévoir leur migration si elles doivent être conservées.

## 3. Backend Render

Créer un Blueprint à partir du dépôt GitHub et sélectionner `render.yaml`. Vérifier que le service est bien en plan Free.

Renseigner les trois variables Neon, `ADMIN_EMAIL`, un `ADMIN_PASSWORD` fort, `CORS_ALLOWED_ORIGINS` avec l'origine HTTPS exacte du frontend (sans slash final), et les cinq variables R2 de l'étape 5. Si l'adresse frontend n'est pas encore connue, mettre temporairement `http://localhost:3000` puis la remplacer après l'étape 4.

Le secret JWT est généré par Render. Ne pas publier les secrets dans GitHub ou dans une conversation. Les identifiants administrateur ne créent le compte qu'au premier démarrage ; modifier ensuite la variable ne change pas le mot de passe d'un compte existant.

Attendre la fin du démarrage, puis vérifier `https://ADRESSE_API.onrender.com/api/public/values`. Cette adresse sert aussi de contrôle de santé et vérifie l'accès à la base.

## 4. Frontend Vercel

Importer le même dépôt, sélectionner le dossier racine `frontend` et le framework Next.js. Utiliser Node.js 22 et les commandes de build proposées par Vercel.

Définir pour Production avant la compilation :

```text
NEXT_PUBLIC_API_URL=https://ADRESSE_API.onrender.com
INTERNAL_API_URL=https://ADRESSE_API.onrender.com
```

Déployer puis reporter l'origine finale `https://ADRESSE_FRONTEND.vercel.app` dans `CORS_ALLOWED_ORIGINS` sur Render. Toute modification de `NEXT_PUBLIC_API_URL` nécessite une nouvelle compilation du frontend.

Vercel Hobby est réservé à un usage personnel non commercial. Vérifier que l'usage de l'association est éligible avant de retenir cette offre ; sinon choisir un hébergeur adapté.

## 5. Fichiers : stockage persistant (Cloudflare R2)

Le backend stockait initialement images et documents sur le disque local, effacé sur Render Free à chaque redémarrage/redéploiement/veille. C'est désormais résolu : `R2FileStorageService` (bucket Cloudflare R2, compatible S3) remplace `LocalFileStorageService` en production, activé par `STORAGE_PROVIDER=r2`. En local/dev, `STORAGE_PROVIDER` reste absent et le stockage disque continue de fonctionner comme avant (aucun changement de comportement).

Étapes côté Cloudflare (aucune carte bancaire requise pour le plan gratuit — 10 Go inclus) :

1. Créer un compte Cloudflare, puis un bucket R2 (ex. `enactus-ensi-uploads`).
2. Dans le bucket, activer un accès public : soit le sous-domaine `r2.dev` fourni automatiquement (rapide, suffisant pour démarrer), soit un domaine personnalisé.
3. Créer un jeton d'API R2 (« Manage R2 API Tokens ») avec permission lecture/écriture sur ce bucket. Noter l'`Access Key ID`, la `Secret Access Key`, et l'identifiant de compte Cloudflare (`Account ID`, visible dans l'URL du dashboard R2 ou la page « R2 » à droite).
4. Renseigner dans Render les cinq variables :

```text
STORAGE_PROVIDER=r2
R2_ACCOUNT_ID=IDENTIFIANT_COMPTE
R2_ACCESS_KEY_ID=CLE_ACCES
R2_SECRET_ACCESS_KEY=CLE_SECRETE
R2_BUCKET=enactus-ensi-uploads
R2_PUBLIC_BASE_URL=https://pub-XXXXXXXX.r2.dev
```

`R2_PUBLIC_BASE_URL` ne doit pas avoir de slash final. Les fichiers locaux déjà présents dans l'installation de développement ne sont pas transférés automatiquement vers R2 ; les re-téléverser depuis l'admin après la bascule si nécessaire.

## 6. Vérification finale

- Pages publiques, projets et événements accessibles via HTTPS.
- Connexion administrateur et création/modification d'un contenu fonctionnelles.
- Aucune requête du navigateur vers localhost et aucune erreur CORS.
- Après intégration du stockage persistant : téléverser un fichier, redémarrer le backend et vérifier qu'il reste accessible.
- Tester après une période d'inactivité : Render Free se met en veille après 15 minutes et le réveil peut prendre environ une minute.

## Documentation officielle

- https://render.com/docs/free
- https://render.com/docs/blueprint-spec
- https://neon.com/pricing
- https://vercel.com/docs/limits/fair-use-guidelines
- https://developers.cloudflare.com/r2/get-started/
