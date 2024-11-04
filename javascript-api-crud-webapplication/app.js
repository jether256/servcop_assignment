const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';
const POSTS_PER_PAGE = 10;
let posts = [];
let currentPage = 1;

// Fetch posts from API
async function loadPosts() {
    const response = await fetch(POSTS_URL);
    posts = await response.json();
    localStorage.setItem('posts', JSON.stringify(posts));
    renderPosts();
    setupPagination();
}

// Check if data already exists in localStorage
if (!localStorage.getItem('posts')) {
    loadPosts();
} else {
    posts = JSON.parse(localStorage.getItem('posts'));
    renderPosts();
    setupPagination();
}





function renderPosts() {
    const postList = document.getElementById('post-list');
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    const paginatedPosts = posts.slice(start, start + POSTS_PER_PAGE);

    postList.innerHTML = paginatedPosts.map(post => `
        <div class="col-md-6">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.body}</p>
                    <button onclick="editPost(${post.id})" class="btn btn-primary">Edit</button>
                    <button onclick="deletePost(${post.id})" class="btn btn-danger">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}


//sp paginationetu
function setupPagination() {
    const pagination = document.getElementById('pagination');
    const pageCount = Math.ceil(posts.length / POSTS_PER_PAGE);
    pagination.innerHTML = '';

    for (let i = 1; i <= pageCount; i++) {
        pagination.innerHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }
}

function changePage(page) {
    currentPage = page;
    renderPosts();
    setupPagination();
}







// create post

function showCreateModal() {
    // Clear form fields for new post
    document.getElementById('postId').value = '';
    document.getElementById('postTitle').value = '';
    document.getElementById('postBody').value = '';
    
    // Set modal title for create mode
    document.getElementById('modalTitle').textContent = 'Create Post';
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('postModal'));
    modal.show();
}


//edit post

function showEditModal(postId) {
    // Find the post by id
    const post = posts.find(p => p.id === postId);
    
    // Populate the form with the existing post data
    document.getElementById('postId').value = post.id;
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postBody').value = post.body;
    
    // Set modal title for edit mode
    document.getElementById('modalTitle').textContent = 'Edit Post';
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('postModal'));
    modal.show();
}








function addPost(title, body) {
    const newPost = { id: Date.now(), title, body };
    posts.unshift(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    renderPosts();
    setupPagination();
}

function editPost(id) {
    const post = posts.find(p => p.id === id);
    document.getElementById('postId').value = post.id;
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postBody').value = post.body;
    document.getElementById('modalTitle').textContent = 'Edit Post';
    const modal = new bootstrap.Modal(document.getElementById('postModal'));
    modal.show();

}

function deletePost(id) {
    posts = posts.filter(p => p.id !== id);
    localStorage.setItem('posts', JSON.stringify(posts));
    renderPosts();
    setupPagination();
}

document.getElementById('postForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const postId = document.getElementById('postId').value;
    const title = document.getElementById('postTitle').value;
    const body = document.getElementById('postBody').value;

    if (postId) {
        // Update post
        const post = posts.find(p => p.id == postId);
        post.title = title;
        post.body = body;
    } else {
        // Add new post
        addPost(title, body);
    }
    localStorage.setItem('posts', JSON.stringify(posts));
    renderPosts();
    setupPagination();
    modal.hide();
    new bootstrap.Modal(document.getElementById('postModal')).hide();
});
