var Product_data = [
  {
    "id": 1,
    "title": "Hydrating Face Cream",
    "price": 24,
    "image": "https://www.sugarcosmetics.com/cdn/shop/files/Tan-Ban-4-Niacinamide-Sunscreen-Light-Gel_065e5800.jpg?v=1746618844&width=700",
    "category": "Skincare"
  },
  {
    "id": 2,
    "title": "Matte Liquid Lipstick",
    "price": 14,
    "image": "https://www.sugarcosmetics.com/cdn/shop/files/Partner-In-Shine-Transferproof-Lip-Gloss-10_e78f81f7.jpg?v=1750416433&width=700",
    "category": "Makeup"
  },
  {
    "id": 3,
    "title": "Volumizing Mascara",
    "price": 18,
    "image": "https://www.sugarcosmetics.com/cdn/shop/files/Uptown-Curl-Lengthening-Mascara-01-Black-Beauty-Black.jpg?v=1743677022&width=500",
    "category": "Eye Makeup"
  }
]

var existing = JSON.parse(localStorage.getItem("Product_Local")) || [];

if (existing.length === 0) {
  localStorage.setItem("Product_Local", JSON.stringify(Product_data));
}

var btn = document.querySelector(".add_product");
var Product_Image = ""
var edit = null



document.getElementById("proimage").addEventListener("change", (event) => {
  const file = event.target.files[0]

  if (file) {
    const reader = new FileReader()
    reader.onload = function (e) {
      Product_Image = e.target.result
    }
    reader.readAsDataURL(file)
  }
})

function checkerror() {
  document.querySelectorAll(".error").forEach(e => e.textContent = "");

  let isValid = true;

  let pro_name = document.getElementById("pro_name").value.trim()
  let pro_price = document.getElementById("pro_price").value.trim()
  let pro_category = document.getElementById("pro_category").value.trim()

  if (pro_name === "") {
    document.getElementById("err_name").textContent = "Product name is required";
    isValid = false;
  }
  if (Product_Image === "") {
    document.getElementById("err_image").textContent = "Main image is required";
    isValid = false;
  }
  if (pro_price === "") {
    document.getElementById("err_org").textContent = "Price required";
    isValid = false;
  }
  if (pro_category === "") {
    document.getElementById("err_category").textContent = "Add category";
    isValid = false;
  }

  return isValid;

}

function addProduct() {
  document.getElementById("product_form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!checkerror()) return;

    let pro_name = document.getElementById("pro_name").value.trim()
    let pro_price = document.getElementById("pro_price").value.trim()
    let pro_category = document.getElementById("pro_category").value.trim()

    let newId = existing.length > 0
      ? existing[existing.length - 1].id + 1
      : 1;

    let product_add_data = {
      id: newId,
      title: pro_name,
      price: pro_price,
      image: Product_Image,
      category: pro_category
    }

    if (edit == null) {
      existing.push(product_add_data);
    } else {
      existing[edit] = {
        title: pro_name,
        price: pro_price,
        image: Product_Image,
        category: pro_category
      };
      edit = null
      btn.textContent = "Add Product";
    }

    localStorage.setItem("Product_Local", JSON.stringify(existing));

    addProductToList();
    event.target.reset();
    Product_Image = "";

  })
  loadCategories();
  applyFilters();

}
addProduct()

function addProductToList(data = existing) {
  let Show_Product = document.querySelector(".Show-Product")
  Show_Product.innerHTML = ''

  data.map((item) => {
    let Show_Product_col = document.createElement("div")
    Show_Product_col.classList.add("col")

    let originalIndex = existing.indexOf(item);

    Show_Product_col.innerHTML = `
  <div class="card h-100 d-flex flex-column border-0 position-relative">
      <div class="card h-100 d-flex flex-column border-0 position-relative">

      <div class="icon-wrapper d-flex flex-column position-absolute top-0 end-0 mt-2 me-2" style="z-index: 9999;">
        <i class="bi bi-trash fs-5 mb-2" style="cursor: pointer;" onclick="deleteProduct(${originalIndex})"></i>
        <a href="#ontop"><i class="bi bi-pencil-square fs-5" style="cursor: pointer;" onclick="editProduct(${originalIndex})"></i></a>
      </div>

    <div class="img-wrapper rounded">
      <img
        src="${item.image}"
        class="card-img-top go-detail" 
        alt="Product Image" 
        style="cursor: pointer;">
    </div>

    <div class="card-body d-flex flex-column p-2">
      <p class="small mb-1">${item.title}</p>
      <p class="mb-1">
        <strong>₹ ${item.price}</strong>
      </p>
    </div>

  </div>
`;

    Show_Product.appendChild(Show_Product_col)
  })
}
addProductToList()

function deleteProduct(index) {
  existing.splice(index, 1)
  localStorage.setItem("Product_Local", JSON.stringify(existing))
  addProductToList()
  loadCategories();
applyFilters();

}

function editProduct(index) {

  let data = existing[index]

  document.getElementById("pro_name").value = data.title
  document.getElementById("pro_price").value = data.price
  document.getElementById("pro_category").value = data.category
  Product_Image = data.image


  edit = index
  btn.innerHTML = "Update Product"
}


var filteredData = [...existing];

var search = document.getElementById("search");
var searchbtn = document.getElementById("searchbtn");
var sorting = document.getElementById("sorting");
var dropdown = document.getElementById("category_dropdown");


function applyFilters() {
  const search = document.getElementById("search");
  const sorting = document.getElementById("sorting");
  const dropdown = document.getElementById("category_dropdown");

  let tempData = [...existing];

  if (search.value.trim() !== "") {
    tempData = tempData.filter(item =>
      item.title.toLowerCase().includes(search.value.toLowerCase())
    );
  }

  if (dropdown.value !== "") {
    tempData = tempData.filter(item =>
      item.category === dropdown.value
    );
  }

  if (sorting.value === "high_to_low") {
    tempData.sort((a, b) => b.price - a.price);
  } else if (sorting.value === "low_to_high") {
    tempData.sort((a, b) => a.price - b.price);
  }

  addProductToList(tempData);
}



searchbtn.addEventListener("click", applyFilters);

sorting.addEventListener("change", applyFilters);

dropdown.addEventListener("change", applyFilters);


function loadCategories() {
  const dropdown = document.getElementById("category_dropdown");
  if (!dropdown) return;

  dropdown.innerHTML = `<option value="">Select Category</option>`;

  const categories = [...new Set(existing.map(item => item.category))];

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    dropdown.appendChild(option);
  });
}
loadCategories();


