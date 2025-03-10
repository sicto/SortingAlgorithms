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

async function animateSwap(el1, el2) {
  return new Promise((resolve) => {
    let element1 = el1;
    let element2 = el2;
    element1.classList.add('active');
    element2.classList.add('active');
    let element1Position = element1.getBoundingClientRect();
    let element2Position = element2.getBoundingClientRect();

    let swapDistance = element2Position.left - element1Position.left;

    element1.style.transition = "transform 0.5s ease";
    element2.style.transition = "transform 0.5s ease";


    element1.style.transform = `translateX(${swapDistance}px)`;
    element2.style.transform = `translateX(-${swapDistance}px)`;

    setTimeout(() => {
      element1.style.transition = "";
      element2.style.transition = "";
      element1.style.transform = "";
      element2.style.transform = "";
      element1.classList.remove('active');
      element2.classList.remove('active');

      element1.parentNode.insertBefore(element2, element1);

      resolve();
    }, timer());
  })
};

function timer() {
  let numberOfElements = parseInt(numElementsInput.value);

  if (numberOfElements < 500)
    return 100;
  if (numberOfElements >= 500 && numElementsInput < 750)
    return 50;
  if (numberOfElements >= 750)
    return 1;
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

        let pom1 = elements[i];
        elements[i] = elements[i + 1];
        elements[i + 1] = pom1;

        sorted = false;
      }
    }

    let lastElement = elements[n - 1];
    lastElement.classList.add('sorted');
    n--;
  }

  elements.forEach((element) => {
    element.classList.add('sorted');
  })

}

function reset() {
  document.querySelectorAll('.array-container').forEach(container => container.remove());
  document.getElementById('createArrayBtn').disabled = false;
  document.getElementById('sortArrayBtn').disabled = false;
  document.getElementById('numElementsInput').value = '';
}
document.getElementById('resetBtn').addEventListener('click', reset);

