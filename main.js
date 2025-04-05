// Initialize Google Sign-In on window load
window.onload = () => {
  google.accounts.id.initialize({
    client_id: "631503031767-svs2t8ebq2169ruq7n7ehq5ln8ig78qd.apps.googleusercontent.com",
    callback: handleCredentialResponse
  });
  google.accounts.id.prompt();
};

function handleCredentialResponse(response) {
  const decoded = parseJwt(response.credential);
  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.value = decoded.email;
    console.log("Signed in as:", decoded.email);
  } else {
    console.warn("Email field not found.");
  }
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

let itemCount = 0;
function addItemBox() {
  itemCount++;
  const container = document.getElementById("itemContainer");
  const itemBox = document.createElement("div");
  itemBox.className = "item-box";

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const defaultDate = new Date(today);
  defaultDate.setDate(today.getDate() + 7);
  const defaultDateStr = defaultDate.toISOString().split("T")[0];

  itemBox.innerHTML = `
    <h5>Item ${itemCount}</h5>
    <div class="form-row">
      <div class="form-group col-md-5">
        <label class="required">Name / Description</label>
        <input type="text" class="form-control" name="name_${itemCount}" required>
      </div>
      <div class="form-group col-md-2">
        <label class="required">Quantity</label>
        <input type="number" class="form-control" name="quantity_${itemCount}" step="1.00" required>
      </div>
      <div class="form-group col-md-2">
        <label class="required">Unit</label>
        <select class="form-control" name="unit_${itemCount}">
          <option value="pcs">pcs</option>
          <option value="kg">kg</option>
          <option value="gms">gms</option>
          <option value="ft">ft</option>
          <option value="sqft">sqft</option>
          <option value="litre">litre</option>
          <option value="inch">inch</option>
          <option value="sq inch">sq inch</option>
          <option value="mm">mm</option>
          <option value="cm">cm</option>
          <option value="mtr">mtr</option>
        </select>
      </div>
      <div class="form-group col-md-2">
        <label>Est. Unit Price</label>
        <input type="number" class="form-control" name="unitPrice_${itemCount}" step="1.00">
      </div>
      <div class="form-group col-md-1">
        <label>GST %</label>
        <select class="form-control" name="gst_${itemCount}">
          <option value="0">0%</option>
          <option value="5">5%</option>
          <option value="12">12%</option>
          <option value="18">18%</option>
          <option value="28">28%</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group col-md-1">
        <label>Type</label>
        <input type="text" class="form-control" name="reqType_${itemCount}" readonly tabindex="-1">
      </div>
      <div class="form-group col-md-4">
        <label>Suggested Vendor</label>
        <input type="text" class="form-control" name="vendor_${itemCount}">
      </div>
      <div class="form-group col-md-3">
        <label class="required">Target Date</label>
        <input type="date" class="form-control" name="neededBy_${itemCount}" min="${todayStr}" value="${defaultDateStr}" required>
      </div>
      <div class="form-group col-md-2">
        <label>Est. Total Price</label>
        <input type="number" class="form-control" name="totalPrice_${itemCount}" readonly tabindex="-1">
      </div>
      <div class="form-group col-md-2">
        <label>Est. Total Incl. GST</label>
        <input type="number" class="form-control" name="totalWithGst_${itemCount}" readonly tabindex="-1">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group col-md-3">
        <label>Remarks</label>
        <textarea class="form-control" name="remarks_${itemCount}" rows="1"></textarea>
      </div>
      <div class="form-group col-md-2">
        <label>Priority</label><br>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" name="priority_${itemCount}" value="Urgent">
          <label class="form-check-label">Urgent</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" name="priority_${itemCount}" value="Important">
          <label class="form-check-label">Important</label>
        </div>
      </div>
      <div class="form-group col-md-2">
        <label>File Upload</label>
        <input type="file" class="form-control-file" name="photo_${itemCount}" onchange="document.getElementById('fileLabel_${itemCount}').textContent = this.files[0]?.name || 'No file chosen';" style="color: transparent;">
        <small id="fileLabel_${itemCount}" class="form-text text-muted">No file chosen</small>
      </div>
      <div class="form-group col-md-5">
        <label class="required">Order For</label>
        <input type="text" class="form-control" name="orderFor_${itemCount}" required>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group col-md-12 button-row"></div>
    </div>`;
  
  container.appendChild(itemBox);
  updateItemControls();
}

function removeItemBox(button) {
  const box = button.closest(".item-box");
  box.remove();
  itemCount--;
  document.querySelectorAll(".item-box h5").forEach((h, i) => h.textContent = `Item ${i + 1}`);
  updateItemControls();
}

function updateItemControls() {
  const boxes = document.querySelectorAll(".item-box");
  boxes.forEach((box, idx) => {
    const row = box.querySelector('.button-row');
    row.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'd-flex w-100';
    if (idx === boxes.length - 1) {
      const addWrapper = document.createElement('div');
      addWrapper.className = 'mr-auto';
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'btn add-btn';
      addBtn.innerText = '+ Add Item';
      addBtn.onclick = addItemBox;
      addWrapper.appendChild(addBtn);
      wrapper.appendChild(addWrapper);
    }
    if (boxes.length > 1) {
      const removeWrapper = document.createElement('div');
      removeWrapper.className = 'ml-auto';
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn remove-btn';
      removeBtn.innerText = '- Remove Item';
      removeBtn.onclick = function () { removeItemBox(removeBtn); };
      removeWrapper.appendChild(removeBtn);
      wrapper.appendChild(removeWrapper);
    }
    row.appendChild(wrapper);
  });
}

function setUserDetails(user) {
  const requestee = document.getElementById("requestee");
  requestee.innerHTML = `<option value="${user.name}">${user.name}</option>`;
  document.getElementById("department").value = user.department;
}

// Ensure the first item is added and handle form submission
document.addEventListener("DOMContentLoaded", function () {
  addItemBox();

  const iframe = document.querySelector("iframe[name='hidden_iframe']");
  if (iframe) {
    iframe.addEventListener("load", function () {
      const emailVal = document.getElementById("email").value;
      alert("Form submitted successfully!");
      document.getElementById("requisitionForm").reset();
      document.getElementById("email").value = emailVal;
    });
  }
});
