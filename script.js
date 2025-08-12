const seqYes = [0x17, 0xff, 0xff, 0xff, 0x02, 0x01, 0x40, 0x7a, 0x28, 0x14, 0x14, 0x14, 0xc8, 0x31, 0xde, 0x03];
const seqNo = [0x17, 0xff, 0xff, 0xff, 0x02, 0x40, 0x7a, 0x28, 0x14, 0x14, 0x14, 0xc8, 0xff, 0xff, 0xde, 0x03];

let sequence = [];
let currentStep = 'step0';
let step4 = 0;
let bits = new Array(16).fill(0);
const steps = [
  'step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'result'
];

document.getElementById('startBtn').addEventListener('click', () => {
  document.getElementById('step0').style.display='none';
  showStep('step1');
  currentStep='step1'; 
});

document.getElementById('thankBtn').addEventListener('click', () => {
  window.location.href = 'https://yoomoney.ru/to/4100166614532';
});
document.getElementById('skipBtn').addEventListener('click', () => {
  document.getElementById('result').style.display='none';
  document.getElementById('thanks').style.display='block';
});

document.querySelectorAll('.answerBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    handleAnswer(btn.dataset.answer);
  });
});

function showStep(id) {
  steps.forEach(s => {
    document.getElementById(s).style.display = (s===id) ? 'flex' : 'none';
  });
}

function handleAnswer(answer) {
	
  switch(currentStep) {
    case 'step1':
      sequence = (answer==='yes') ? [...seqYes] : [...seqNo];
	  if (answer === 'yes') { step4 = 1;}
      showStep('step2');
      break;
    case 'step2':
      if (answer==='auto') {
        setBitInSequence(2,0);
        setBitInSequence(12,1);
      } else {
        setBitInSequence(2,1);
        setBitInSequence(12,0);
      }
      showStep('step3');
      break;
    case 'step3':
      if (answer==='yes') {
        setBitInSequence(6,1);
      } else {
        setBitInSequence(6,0);
      }
      showStep('step4');
      break;
    case 'step4':
      if (answer==='yes') {
        setBitInSequence(1,1);
        setBitInSequence(11,1);
      } else {
        setBitInSequence(1,0);
        setBitInSequence(11,0);
      }
      if (step4=== 1 && answer==='yes') {
        showStep('step5');
      } else {
        showStep('step6');
      }
	  break;
    case 'step5':
      if (answer==='yes') {
        setBitInSequence(9,1);
      } else {
        setBitInSequence(9,0);
      }
      showStep('step6');
      break;
    case 'step6':
      if (answer==='km') {
        setBitInSequence(15,0);
      } else {
        setBitInSequence(15,1);
      }
      finalize();
      break;
  }

  if (currentStep==='step1') {
    currentStep='step2';
  } else if (currentStep==='step2') {
    currentStep='step3';
  } else if (currentStep==='step3') {
    currentStep='step4';
  }
    else if (currentStep==='step4') {
    if (step4 === 1) {
      currentStep='step5';
    } else {
      currentStep='step6';
    }
  } else if (currentStep==='step4') {
    currentStep='step6';
  } else if (currentStep==='step5') {
    currentStep='step6';
  }
}

function setBitInSequence(bitIndex, value) {
  bits[bitIndex] = value ? 1 : 0;
  
}

function finalize() {
  let sum=0;
  let byte1=0;
  let byte2=0;
  let summ8=0;
  let xor_checksum = sequence[0]; 
  for (let i = 0; i < 8; i++) {
    byte1 = (byte1 << 1) | bits[i];
}
  for (let i = 8; i < 16; i++) {
    byte2 = (byte2 << 1) | bits[i];
}
  sequence[2]=byte1;
  sequence[3]=byte2;
  for (let i = 0; i < sequence.length; i++) {
    summ8 = (summ8 + sequence[i]) & 0xFF; 
}
  summ8 = summ8 ^ 0xFF;
   
  for (let i = 1; i < sequence.length; i++) {
    xor_checksum = xor_checksum ^ sequence[i]; 
}
   
  xor_checksum = xor_checksum + 1;
  const deDfHex = byte1.toString(16).padStart(2, '0') + byte2.toString(16).padStart(2, '0');
  const ecEdHex = summ8.toString(16).padStart(2, '0') + xor_checksum.toString(16).padStart(2, '0');

  document.getElementById('deDf').textContent=deDfHex;
  document.getElementById('ecEd').textContent=ecEdHex;
  showStep('result');
}

