let button = document.querySelector('button')[0];
let count = document.querySelector('#count');
button.addEventListener('click', function() {
  count.innerHTML++;
});