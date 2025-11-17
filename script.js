const defaultConfig = {
  game_title: "❄️ Snowflake Feelings Match 🧤",
  instructions: "Drag each winter emoji to match with the feeling word! Listen to each word by clicking the speaker button.",
  success_message: "Great job! You matched all the feelings!"
};

let config = { ...defaultConfig };
let correctMatches = 0;
let totalMatches = 5;

function speak(text) {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    const voices = speechSynthesis.getVoices();
    const childVoice = voices.find(voice =>
      voice.name.includes('Google') ||
      voice.name.includes('Female') ||
      voice.lang.startsWith('en')
    );
    if (childVoice) {
      utterance.voice = childVoice;
    }

    speechSynthesis.speak(utterance);
  }
}

function initializeDragAndDrop() {
  const draggables = document.querySelectorAll('.draggable');
  const dropZones = document.querySelectorAll('.drop-zone');

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', handleDragStart);
    draggable.addEventListener('dragend', handleDragEnd);
  });

  dropZones.forEach(zone => {
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('dragenter', handleDragEnter);
    zone.addEventListener('dragleave', handleDragLeave);
    zone.addEventListener('drop', handleDrop);
  });
}

function handleDragStart(e) {
  this.classList.add('dragging');
  e.dataTransfer.setData('text/plain', this.dataset.emoji);
  e.dataTransfer.setData('feeling', this.dataset.feeling);
}

function handleDragEnd() {
  this.classList.remove('dragging');
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDragEnter(e) {
  e.preventDefault();
  this.classList.add('drag-over');
}

function handleDragLeave() {
  this.classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  this.classList.remove('drag-over');

  const draggedEmoji = e.dataTransfer.getData('text/plain');
  const draggedFeeling = e.dataTransfer.getData('feeling');
  const targetFeeling = this.dataset.feeling;

  if (!draggedEmoji || !draggedFeeling) return;

  if (draggedFeeling === targetFeeling) {
    this.classList.add('correct');
    const emojiSlot = this.querySelector('.emoji-slot');
    emojiSlot.innerHTML = `<div class="text-4xl celebration">${draggedEmoji}</div>`;

    const draggedElement = document.querySelector(`[data-emoji="${draggedEmoji}"]`);
    if (draggedElement) {
      draggedElement.style.display = 'none';
    }

    correctMatches++;
    speak('Correct! Great match!');

    if (correctMatches === totalMatches) {
      setTimeout(showSuccessMessage, 1000);
    }

    setTimeout(() => {
      this.classList.remove('correct');
    }, 1000);
  } else {
    this.classList.add('incorrect');
    speak("Try again! That doesn't match.");
    setTimeout(() => {
      this.classList.remove('incorrect');
    }, 1000);
  }
}

function showSuccessMessage() {
  document.getElementById('success-message').classList.remove('hidden');
  speak(config.success_message);
  document.querySelectorAll('.emoji-slot div').forEach(emoji => {
    emoji.classList.add('celebration');
  });
}

function resetGame() {
  correctMatches = 0;
  document.getElementById('success-message').classList.add('hidden');

  document.querySelectorAll('.draggable').forEach(item => {
    item.style.display = 'block';
  });

  document.querySelectorAll('.emoji-slot').forEach(slot => {
    slot.innerHTML = '';
  });

  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.classList.remove('correct', 'incorrect', 'drag-over');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeDragAndDrop();

  if ('speechSynthesis' in window) {
    speechSynthesis.getVoices();
    speechSynthesis.addEventListener('voiceschanged', () => {
      speechSynthesis.getVoices();
    });
  }

  setTimeout(() => {
    speak('Welcome to Snowflake Feelings Match! Drag each winter emoji to match with the feeling word.');
  }, 1200);

  document.getElementById('title-speak').addEventListener('click', () => {
    speak(config.game_title.replace(/[❄️🧤]/g, ''));
  });

  document.getElementById('instructions-speak').addEventListener('click', () => {
    speak(config.instructions);
  });

  document.getElementById('success-speak').addEventListener('click', () => {
    speak(config.success_message);
  });

  document.getElementById('play-again').addEventListener('click', resetGame);
});
