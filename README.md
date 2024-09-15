### Vite + VanillaJS + ThreeJS : Earth

Visit GitHub Page: [DEMO](https://czampath.github.io/vite-basic-earth/) - 8K Resolution

A simple web application showcasing an interactive 3D Earth using Three.js and Vite, inspired by the tutorial provided by [bobbyroe](https://github.com/bobbyroe/threejs-earth).

#### Features

- Star Dome
The `generateStarDome()` function was developed to mathematically populate a slice-opened star dome with slight variations of star colors. It allows for customization of star density, minimum and maximum star sizes, and scatter distance.

- 3D Earth model with high-resolution (16K) textures, (The Demo uses only 8k texures to minimize the overhead)
- Realistic lighting effects including directional light and ambient glow
- Cloud layers with transparency and blending effects
- Interactive camera controls with OrbitControls
- Dynamic starry background generated using a custom function
- Responsive design

#### Installation

1. Clone the repository.
```
git clone https://github.com/czampath/vite-basic-earth
```

2. Install dependencies.
```
npm install
```

3. Run the development server.
```
npm run dev
```

4. Open your browser and navigate to [http://localhost:5173](http://localhost:5173) to view the app.


#### Deploy to Github pages

1. Make sure newly added textures and models are copied into suitable folders inside `/for-build`

2. After to commiting all the changes, move to branch `deploy`

3. Get changes from `master` branch
```
git fetch
```

```
git pull --rebase
```

4. Build app (This may delete exisiting files in `/docs`)
```
npm run build
```

5. Copy everything in `for-build` directory into `docs`

6. Navigate to the `docs` directory where the build is located:

```
    cd docs
```

7. Start the HTTP server:
```
    http-server -p 8000
```

7. Open your browser and go to `http://localhost:8000`

9. Commit and Push changes. You may need to clear Cache


#### Acknowledgments

Special thanks to:
- [bobbyroe](https://github.com/bobbyroe) for the tutorial on creating a 3D Earth with Three.js.
- [Solar System Scope](https://www.solarsystemscope.com/textures/), [Planet Pixel Emporium](https://planetpixelemporium.com/), and [Shaded Relief](https://www.shadedrelief.com/) for providing high-quality textures.

The `getFresnelMat` function was adapted from the tutorial by [bobbyroe](https://github.com/bobbyroe/threejs-earth).

#### License

This project is licensed under the MIT License.

Feel free to customize and expand upon this project to create your own stunning 3D visualizations! If you have any questions or suggestions, please don't hesitate to reach out.
