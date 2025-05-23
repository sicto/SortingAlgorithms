function createArray() {
  let arrayContainer = document.createElement('div');
  arrayContainer.classList.add('array-container');
  let numberOfElements = parseInt(numElementsInput.value);

  if (isNaN(numberOfElements) || numberOfElements < 2 || numberOfElements > 1500) {
    alert("Please enter a valid number of elements between 2 and 1500");
    return;
  }

  let array = [];
  for (let i = 0; i < numberOfElements; i++) {
    array.push(i);
  }

  shuffleArray(array);

  let fragment = document.createDocumentFragment();

  array.forEach((item) => {
    let arrayItem = document.createElement('div');
    arrayItem.classList.add('array-item');
    arrayItem.style.height = ((item + 1) / numberOfElements) * 100 + '%';
    fragment.appendChild(arrayItem);
  });

  arrayContainer.appendChild(fragment);
  document.body.appendChild(arrayContainer);
  document.getElementById('createArrayBtn').disabled = true;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function swapDOMElements(el1, el2) {
  const parent = el1.parentNode;
  const next1 = el1.nextSibling;
  const next2 = el2.nextSibling;

  if (next1 === el2) {
    parent.insertBefore(el2, el1);
  } else if (next2 === el1) {
    parent.insertBefore(el1, el2);
  } else {
    parent.insertBefore(el2, next1);
    parent.insertBefore(el1, next2);
  }
}

async function animateSwap(el1, el2) {
  return new Promise((resolve) => {
    el1.classList.add('active');
    el2.classList.add('active');

    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();
    const distance = rect2.left - rect1.left;

    el1.style.transition = "transform 0.5s ease";
    el2.style.transition = "transform 0.5s ease";

    el1.style.transform = `translateX(${distance}px)`;
    el2.style.transform = `translateX(${-distance}px)`;

    setTimeout(() => {
      el1.style.transition = "";
      el2.style.transition = "";
      el1.style.transform = "";
      el2.style.transform = "";
      el1.classList.remove('active');
      el2.classList.remove('active');

      swapDOMElements(el1, el2);

      resolve();
    }, timer());
  });
}

function timer() {
  let numberOfElements = parseInt(numElementsInput.value);

  if (numberOfElements < 500) return 100;
  if (numberOfElements >= 500 && numberOfElements < 750) return 50;
  if (numberOfElements >= 750) return 1;
}

async function bubbleSort() {
  let elements = Array.from(document.querySelectorAll('.array-item'));
  let n = elements.length;
  let sorted = false;
  document.getElementById('sortArrayBtn').disabled = true;

  while (!sorted) {
    sorted = true;

    for (let i = 0; i < n - 1; i++) {
      let height1 = parseFloat(elements[i].style.height);
      let height2 = parseFloat(elements[i + 1].style.height);

      if (height1 > height2) {
        await animateSwap(elements[i], elements[i + 1]);
        elements = Array.from(document.querySelectorAll('.array-item'));
        sorted = false;
      }
    }

    let lastElement = elements[n - 1];
    lastElement.classList.add('sorted');
    n--;
  }

  elements.forEach((element) => {
    element.classList.add('sorted');
  });
}

async function quickSort(start, end) {
  if (start >= end) {
    if (start === end) {
      let elements = document.querySelectorAll('.array-item');
      elements[start].classList.add('sorted');
    }
    return;
  }

  let pivotIndex = await partition(start, end);

  await Promise.all([
    quickSort(start, pivotIndex - 1),
    quickSort(pivotIndex + 1, end)
  ]);
}

async function partition(start, end) {
  let elements = document.querySelectorAll('.array-item');
  let pivot = elements[end];
  pivot.classList.add('pivot');
  let pivotHeight = parseFloat(pivot.style.height);
  let pivotIndex = start;

  for (let i = start; i < end; i++) {
    elements = document.querySelectorAll('.array-item');
    let current = elements[i];
    let currentHeight = parseFloat(current.style.height);
    current.classList.add('active');

    if (currentHeight < pivotHeight) {
      await animateSwap(current, elements[pivotIndex]);
      elements = document.querySelectorAll('.array-item');
      pivotIndex++;
    }

    current.classList.remove('active');
  }

  elements = document.querySelectorAll('.array-item');
  await animateSwap(elements[pivotIndex], elements[end]);

  elements = document.querySelectorAll('.array-item');
  elements[end].classList.remove('pivot');
  elements[pivotIndex].classList.remove('pivot');
  elements[pivotIndex].classList.add('sorted');


  return pivotIndex;
}

function reset() {
  document.querySelectorAll('.array-container').forEach(container => container.remove());
  document.getElementById('createArrayBtn').disabled = false;
  document.getElementById('sortArrayBtn').disabled = false;
  document.getElementById('numElementsInput').value = '';
}

document.getElementById('quickSortBtn').addEventListener('click', async () => {
  const elements = document.querySelectorAll('.array-item');
  await quickSort(0, elements.length - 1);
});

document.getElementById('resetBtn').addEventListener('click', reset);
