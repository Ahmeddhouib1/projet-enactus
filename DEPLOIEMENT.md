# Hébergement gratuit — Enactus ENSI

Configuration préparée, mais aucun déploiement distant n'a encore été effectué.

## Services

- Frontend Next.js : Vercel Hobby, sous réserve d'éligibilité à son usage personnel non commercial.
- API Java : Render Free, avec le fichier `render.yaml` à la racine.
- PostgreSQL : Neon Free. Ne pas utiliser la base gratuite Render pour une installation durable : elle expire après 30 jours.

Les offres gratuites ont des quotas. Choisir explicitement les formules gratuites et ne pas activer d'offre payante. Le sous-domaine fourni suffit ; aucun domaine à acheter.

## 1. Dépôt GitHub

Créer un dépôt privé et y envoyer les sources. Ne jamais ajouter `.env`, les fichiers téléversés, `node_modules` ou les dossiers de compilation. Le dépôt local n'a actuellement aucun dépôt distant configuré.

## 2. Base Neon

Créer un projet Free en région européenne, puis récupérer l'hôte, le nom de base, l'utilisateur et le mot de passe dans Connect. Utiliser de préférence l'hôte direct pour les migrations Flyway.

Dans Render, renseigner séparément :

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://HOTE_NEON/NOM_BASE?sslmode=require
DB_USERNAME=UTILISATEUR_NEON
DB_PASSWORD=MOT_DE_PASSE_NEON
```

Ne pas coller une URL `postgresql://utilisateur:motdepasse@...` dans le champ JDBC. Spring Boot accepte directement `SPRING_DATASOURCE_URL`, qui remplace la configuration locale sans modification du code.

Une nouvelle base reçoit les migrations et données initiales du projet. Les données et fichiers de l'installation locale ne sont pas transférés automatiquement ; prévoir leur migration si elles doivent être conservées.

## 3. Backend Render

Créer un Blueprint à partir du dépôt GitHub et sélectionner `render.yaml`. Vérifier que le service est bien en plan Free.

Renseigner les trois variables Neon, `ADMIN_EMAIL`, un `ADMIN_PASSWORD` fort et `CORS_ALLOWED_ORIGINS` avec l'origine HTTPS exacte du frontend, sans slash final. Si l'adresse frontend n'est pas encore connue, mettre temporairement `http://localhost:3000` puis la remplacer après l'étape 4.

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

## 5. Fichiers : point à résoudre avant utilisation réelle

Le projet stocke actuellement images et documents dans le disque local du backend. Sur Render Free, ces fichiers disparaissent au redémarrage, au redéploiement ou à la mise en veille. Les enregistrements PostgreSQL restent, mais leurs liens deviennent inutilisables.

Avant de confier des données au CMS, remplacer `LocalFileStorageService` par un stockage externe persistant (par exemple un stockage objet disposant d'une offre gratuite), puis transférer les fichiers locaux nécessaires. Cette intégration n'est pas encore réalisée. Le stockage doit couvrir les images ET les documents et préserver leurs règles d'accès.

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
