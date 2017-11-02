import App from './app';

App.load().then(() => {
	window.app = new App({ parent: document.body });
});
