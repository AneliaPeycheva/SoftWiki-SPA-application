import { createFormEntity } from './form-helpers.js';
import { fireBaseRequestFactory } from './firebase-requests.js';
import { requester } from './app-service.js';
import { successNotification } from './notifications.js'
import { errorNotification } from './notifications.js'
const apiKey = 'https://trecksapp.firebaseio.com/';
requester.init(apiKey, sessionStorage.getItem('token'));



async function applyCommon() {

    this.email = sessionStorage.getItem('email');
    this.loggedIn = !!sessionStorage.getItem('token');

    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs')
    };

}

async function homeViewHandler() {
    await applyCommon.call(this);

    let articles = await requester.articles.getAll();
    this.articles = Object.entries(articles || {}).map(([articleId, article]) => ({ ...article, articleId }));
    this.loggedInWithArticles = sessionStorage.getItem('token') && this.articles.length > 0;

    this.loggedInWithNoArticles = sessionStorage.getItem('token') && this.articles.length === 0;
    console.log(Object.entries(articles || {}).map(([articleId, article]) => ({ ...article, articleId })));
    await this.partial('./templates/home/home.hbs');
    let containerJS = document.querySelector('section.js>div.articles');
    let containerC = document.querySelector('section.CSharp>div.articles');
    let containerJava = document.querySelector('section.Java>div.articles');
    let containerP = document.querySelector('section.Python>div.articles');
    let allArticles = Object.entries(articles || {}).map(([articleId, article]) => ({ ...article, articleId }));
    allArticles.sort((a, b) => a.title.localeCompare(b.title));

    allArticles.forEach(article => {
        if (article.category === 'Python') {
            let wrapper = document.createElement('article');
            wrapper.classList.add('content');
            let h3 = document.createElement('h3');
            h3.textContent = article.title;
            let p = document.createElement('p');
            p.textContent = article.content;
            wrapper.appendChild(h3);
            wrapper.appendChild(p);
            var anchorTag = document.createElement('a');
            anchorTag.setAttribute('href', `#/details/${article.articleId}`);
            // anchorTag.classList.add('btn details-btn');
            anchorTag.innerHTML = "Details";
            wrapper.appendChild(anchorTag);
            containerP.appendChild(wrapper);
        }
        else if (article.category === 'Java') {
            let wrapper = document.createElement('article');
            wrapper.classList.add('content');
            let h3 = document.createElement('h3');
            h3.textContent = article.title;
            let p = document.createElement('p');
            p.textContent = article.content;
            wrapper.appendChild(h3);
            wrapper.appendChild(p);
            var anchorTag = document.createElement('a');
            anchorTag.setAttribute('href', `#/details/${article.articleId}`);
            // anchorTag.classList.add('btn details-btn');
            anchorTag.innerHTML = "Details";
            wrapper.appendChild(anchorTag);
            containerJava.appendChild(wrapper);
        }
        else if (article.category === 'JavaScript') {
            let wrapper = document.createElement('article');
            wrapper.classList.add('content');
            let h3 = document.createElement('h3');
            h3.textContent = article.title;
            let p = document.createElement('p');
            p.textContent = article.content;
            wrapper.appendChild(h3);
            wrapper.appendChild(p);
            var anchorTag = document.createElement('a');
            anchorTag.setAttribute('href', `#/details/${article.articleId}`);
            // anchorTag.classList.add('btn details-btn');
            anchorTag.innerHTML = "Details";
            wrapper.appendChild(anchorTag);
            containerJS.appendChild(wrapper);
        }
        else if (article.category === 'C#') {
            let wrapper = document.createElement('article');
            wrapper.classList.add('content');
            let h3 = document.createElement('h3');
            h3.textContent = article.title;
            let p = document.createElement('p');
            p.textContent = article.content;
            wrapper.appendChild(h3);
            wrapper.appendChild(p);
            var anchorTag = document.createElement('a');
            anchorTag.setAttribute('href', `#/details/${article.articleId}`);
            // anchorTag.classList.add('btn details-btn');
            anchorTag.innerHTML = "Details";
            wrapper.appendChild(anchorTag);
            containerC.appendChild(wrapper);
        }
    })

}


async function loginHandler() {

    await applyCommon.call(this);

    await this.partial('./templates/login/loginPage.hbs');

    let formRef = document.querySelector('form');
    formRef.addEventListener('submit', async e => {
        e.preventDefault();

        let form = createFormEntity(formRef, ['email', 'password']);
        let formValue = form.getValue();
        try {
            const loggedInUser = await firebase.auth().signInWithEmailAndPassword(formValue.email, formValue.password);
            const userToken = await firebase.auth().currentUser.getIdToken();
            sessionStorage.setItem('email', loggedInUser.user.email);
            sessionStorage.setItem('userId', firebase.auth().currentUser.uid);

            sessionStorage.setItem('token', userToken);
            requester.setAuthToken(userToken);
            successNotification('You have logged already.');
            this.redirect(['#/home']);
        } catch (error) {
            errorNotification(error.message)
        }

    });

}


async function registerViewHandler() {

    await applyCommon.call(this);

    await this.partial('./templates/register/registerPage.hbs');

    let formRef = document.querySelector('form');
    formRef.addEventListener('submit', async (e) => {
        e.preventDefault();
        let form = createFormEntity(formRef, ['email', 'password', 'rep-pass']);
        let formValue = form.getValue();

        if (formValue.password !== formValue['rep-pass']) {
            errorNotification('Password and repeat password must match');
            return;
        }
        try {
            const newUser = await firebase.auth().createUserWithEmailAndPassword(formValue.email, formValue.password);
            console.log(newUser);
            let userToken = await firebase.auth().currentUser.getIdToken();
            console.log(userToken);
            sessionStorage.setItem('email', newUser.user.email);
            sessionStorage.setItem('userId', firebase.auth().currentUser.uid);

            sessionStorage.setItem('token', userToken);
            requester.setAuthToken(userToken);
            successNotification('The registration is successfully.');
            this.redirect(['#/home']);
        } catch (error) {
            errorNotification(error.message)
        }

    });

}

function logoutHandler() {
    sessionStorage.clear();
    firebase.auth().signOut();
    this.redirect(['#/home']);
}
async function createArticleHandler() {

    await applyCommon.call(this);

    await this.partial('./templates/create/createPage.hbs');

    let formRef = document.querySelector('form');
    
    formRef.addEventListener('submit', async e => {
        e.preventDefault();

        let form = createFormEntity(formRef, ['title', 'category', 'content']);
        let formValue = form.getValue();
        if(!formValue.title|| !formValue.category || !formValue.content){
            errorNotification('Every article should have title, category and content.');
            return;
        }
        formValue.creator = sessionStorage.getItem('email');
        formValue.likes = 0;
        try {
            await requester.articles.createEntity(formValue);
            successNotification('The article has created.');
            form.clear();
            this.redirect('#/home');
        } catch (error) {
            errorNotification(error.message);
        }

    });
}
async function detailsHandler() {
    /**
     * Gets one article from the db and map it to the expected by the template value + add it to the template context
     * 
     * -- this.params comes from the navigation url!!
     */
    let { creator, title, content, category, likes } = await requester.articles.getById(this.params.id);
    this.articleId = this.params.id;
    this.creator = creator;
    this.title = title;
    this.content = content;
    this.category = category;
    this.likes = likes;
    this.userIsCreator = sessionStorage.getItem('email') === creator;
    await applyCommon.call(this);
    this.partial('./templates/details/details.hbs');
}
async function likesHandler() {

    await requester.articles.patchEntity({
        likes: Number(this.params.currentLikes) + 1
    }, this.params.id)

    this.redirect(`#/details/${this.params.id}`)
    return false;
}
async function editHandler() {

    await applyCommon.call(this);
    await this.partial('./templates/edit/editPage.hbs');
    /**
     * Handling form events part
     */
    let formRef = document.querySelector('form');
    let form = createFormEntity(formRef, ['title', 'category', 'content']);
    /**
     * Load and set the initial form value for edit
     */
    const articleToEdit = await requester.articles.getById(this.params.id);

    form.setValue(articleToEdit);
    formRef.addEventListener('submit', async e => {
        e.preventDefault();
        let form = createFormEntity(formRef, ['title', 'category', 'content']);
        let formValue = form.getValue();
        await requester.articles.patchEntity(formValue, this.params.id);
        this.redirect('#/home');
    });

}


async function deleteHandler() {

    await requester.articles.deleteEntity(this.params.id);
    this.redirect('#/home');
}

// initialize the application
const app = Sammy('#main', function () {

    this.use('Handlebars', 'hbs');

    this.get('#/', homeViewHandler);
    this.get('#/home', homeViewHandler);
    this.get('#/login', loginHandler);
    this.post('#/login', () => false);
    this.get('#/register', registerViewHandler);
    this.post('#/register', () => false);
    this.get('#/logout', logoutHandler);
    this.get('#/create', createArticleHandler);
    this.post('#/create', () => false);
    this.get('#/details/:id', detailsHandler);
    this.get('#/delete/:id', deleteHandler);
    this.get('#/likes/:currentLikes/:id', likesHandler)

    this.get('#/edit/:id', editHandler);
    this.post('#/edit/:id', () => false);
});

app.run('#/');
