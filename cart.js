function addingCart(event) {
  if (!isUserLoggedIn()) {
    alert('Please log in to add items to the cart');
    return
  }
  alert('Product added to cart')
  const cartIcon = event.target.closest('.cart-icon')
  let items = JSON.parse(localStorage.getItem('items')) || []


  if (cartIcon) {
    const addingElement = cartIcon.closest('.mainMovie')
    const { dataset } = addingElement
    const moviePrice = dataset.type === 'tv' ? 2.99 : 0.99

    let item = { id: dataset.id, title: dataset.title, price: moviePrice, url: addingElement.children[0].style.backgroundImage, no: 1 }

    const existing = items.find(data => item.id === data.id)
    existing ? existing.no += 1 : items.push(item)

    localStorage.setItem('items', JSON.stringify(items))
    renderTable()
    updateCartCount()
    updateTotalCost()
  }
}

function renderTable() {
  const cardBoxTable = document.querySelector('.table');
  let tableData = '<tr><th>№</th><th>Image</th><th>Item Name</th><th>Item No</th><th>Item Price</th><th>Total Price</th><th></th></tr>';
  const items = JSON.parse(localStorage.getItem('items')) || [];

  if (items.length === 0) {
    tableData += '<tr><td colspan="7">No items found</td></tr>';
  } else {
    items.forEach((data, index) => {
      const totalPrice = data.no * data.price;
      tableData += `<tr><td>${index + 1}</td>
      <td><img src="${extractImageUrl(data.url)}" alt="${data.title}" style="width: 80px; height: 120px;"></td>
      <td>${data.title}</td>
      <td><button onclick="decrementItem(${index})">-</button>${data.no}<button onclick="incrementItem(${index})">+</button></td>
      <td>${data.price}</td><td>${totalPrice.toFixed(2)}</td><td><a href="#" onclick="Delete(${index});">Delete</a></td></tr>`;
    });
  }

  cardBoxTable.innerHTML = tableData;
  updateTotalCost();
}


function incrementItem(index) {
  let items = JSON.parse(localStorage.getItem('items')) || []
  items[index].no += 1
  localStorage.setItem('items', JSON.stringify(items))
  renderTable()
  updateCartCount()
}

function decrementItem(index) {
  let items = JSON.parse(localStorage.getItem('items')) || []
  items[index].no > 1 ? items[index].no -= 1 : items.splice(index, 1)
  localStorage.setItem('items', JSON.stringify(items))
  renderTable()
  updateCartCount()
}

function Delete(index) {
  let items = JSON.parse(localStorage.getItem('items')) || []
  items.splice(index, 1)
  localStorage.setItem('items', JSON.stringify(items))
  renderTable()
  updateCartCount()
}

function updateCartCount() {
  const cartCountElement = document.getElementById('cartCount')
  const items = JSON.parse(localStorage.getItem('items')) || []
  const totalCount = items.reduce((acc, item) => acc + item.no, 0)
  cartCountElement.textContent = totalCount
}

function updateTotalCost() {
  const totalCostElement = document.querySelector('.totalCost')
  const items = JSON.parse(localStorage.getItem('items')) || []
  const totalCost = items.reduce((acc, item) => acc + item.no * item.price, 0)
  totalCostElement.textContent = `Total Cost: $${totalCost.toFixed(2)}`
}
function extractImageUrl(styleBackgroundImage) {
  const urlRegex = /url\("(.+)"\)/;
  const match = styleBackgroundImage.match(urlRegex);
  return match ? match[1] : '';
}

const blocksOfMovies = document.querySelector('.explore-blocks')
if (blocksOfMovies) blocksOfMovies.addEventListener('click', event => addingCart(event))

const blocks = document.querySelector('.header-top-rated')
if (blocks) blocks.addEventListener('click', event => addingCart(event))

document.addEventListener('DOMContentLoaded', () => {
  renderTable()
  updateCartCount()
})

function isUserLoggedIn() {
  const loggedInUser = JSON.parse(localStorage.getItem('logged-in'));
  return loggedInUser !== null && loggedInUser !== undefined;
}

  const checkoutButton = document.getElementById('checkoutButton')
  if (checkoutButton) {
    checkoutButton.addEventListener('click', handleCheckout)
  }


function handleCheckout() {
  localStorage.removeItem('items')
  window.location.reload()
  alert('Your order was placed! Thank you for shopping with us.')
}
