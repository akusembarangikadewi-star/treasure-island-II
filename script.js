let x = 600; 
let y = 200;
let conversation = 0;
let nol = 0;//Number Of Logs
let shelter = 0;
let el = 0;//Enough Logs
let ship = 0;
let as = 0;//Abourdboard Ship
let ts = 0;//tree sapling
let hungerjs = 100;
let healthjs = 100;
let HR = false;
let food = 0;
let l2 = 0;
//bark.top = 120
//bark.left = 710
//leaf.top = 110
//leaf.left = 700
//fl2 = fight in level 2

let l = 0;//tree spawn repeat
let barkclonex = 710;
let leafclonex = 700;
let saplingclonex = 710; // Add sapling starting X coordinate

const bark1 = document.getElementById('bark1');
const leaf1 = document.getElementById('leaf1');
const sapling1 = document.getElementById('sapling1'); // Grab the first sapling

while (l < 2) {
    const barkclone = bark1.cloneNode(true);
    const leafclone = leaf1.cloneNode(true);
    const saplingclone = sapling1.cloneNode(true); // Clone the sapling

    barkclonex += 30;
    leafclonex += 30;
    saplingclonex += 30; 

    barkclone.style.left = barkclonex + "px";
    leafclone.style.left = leafclonex + "px";
    saplingclone.style.left = saplingclonex + "px"; // Move the cloned sapling

    barkclone.removeAttribute("id");
    leafclone.removeAttribute("id");
    saplingclone.removeAttribute("id"); // Remove ID so clones don't share it

    bark1.parentElement.appendChild(barkclone);
    leaf1.parentElement.appendChild(leafclone);
    sapling1.parentElement.appendChild(saplingclone); // Add to the screen

    l++;
}
function moveleft() {
  const player = document.querySelector('.player');
  x = x - 10;
  player.style.left = x + "px";

  if (as == 0) {
  if (x < 500) { 
    x = x + 10;
    player.style.left = x + "px";
    }
  }
}

function moveright() {
  const player = document.querySelector('.player');
  x = x + 10;
  player.style.left = x + "px";

  if (x > 800) { 
    x = x - 10;
    player.style.left = x + "px";
  }
}

function moveup() {
  const player = document.querySelector('.player');
  y = y - 10;
  player.style.top = y + "px";

  if (y < 51) { 
    y = y + 10;
    player.style.top = y + "px";
  }
}

function movedown() {
  const player = document.querySelector('.player');
  y = y + 10;
  player.style.top = y + "px";
  
  if (as == 0) {
  if (y > 461) { 
    y = y - 10;
    player.style.top = y + "px";
    }
  }
}

document.addEventListener("keydown", function(event) {
    // A switch statement is useful for handling multiple specific keys
    switch (event.key) {
        case "ArrowUp":
            moveup()
            break;
		case "w" :
		moveup()
		break;
        case "ArrowDown":
            movedown()
            break;
		case "s" :
		movedown()
		break;
        case "ArrowLeft":
            moveleft()
            break;
		case "a":
		moveleft()
		break;
        case "ArrowRight":
            moveright()
            break;
		case "d":
		moveright()
		break;
	    case "i" :
            interaction()
            break;
        case "x":
            closeText()
            break;	
		case "c":
		if (ship == 1) {
	    if (el == 1) {
		as = 1;
		}
      }	 
		break;
        case "Enter":
		cheatdonebutton()
		break;
		case "e":
		eat()
		break;
		
		case "Shift":
		document.querySelector('.player').style.transition = 0.2;
		break;
   }
});

function closeText() {
  if (x == 600 && y == 200) {
    document.querySelector('#start').style.display = 'none'; 
    
    if (HR == false) {
      startHunger(); 
      HR = true;
    }
	
  } 

  if (conversation == 1 ) {
    document.querySelector('#ttnpc1').style.display = 'none';
  }
  
  if (nol < 100) {
    document.querySelector('#ttnpc2').style.display = 'none';
  }
  
  if (nol < 100) {
    document.querySelector('#nel').style.display = 'none';
  }
}
  //hunger code
function startHunger() {
let timer = setInterval(() => {
  hungerjs -= 1;
  document.querySelector('#NOH').innerText = hungerjs;

  // Stop the timer if the variable reaches 0 or goes below
  if (hungerjs <= 0) {
    clearInterval(timer);
	startHealth();
  }
 }, 10000);
}
function startHealth() {
	let timer = setInterval(() => {
		healthjs -= 10;
		document.querySelector('#NOHE').innerText = healthjs;
  // Stop the timer if the variable reaches 0 or goes below
  if (healthjs <= 0) {
    clearInterval(timer);
	
  }
 }, 1000);
}


  //interaction LOGIC
function interaction() {
  const barks = document.querySelectorAll('.bark');
  const leafs = document.querySelectorAll('.leaf');
  const saplings = document.querySelectorAll('.sapling'); // Grab ALL saplings
  
  const npc = document.querySelector('.NPC');
  const ttnpc = document.querySelector('#ttnpc1');
  const ttnpc2 = document.querySelector('#ttnpc2');
  
  const playerx = document.querySelector('.player').getBoundingClientRect().left;
  const playery = document.querySelector('.player').getBoundingClientRect().top; 
  
  const npcleft = npc.getBoundingClientRect().left;
  const npctop = npc.getBoundingClientRect().top;

  // TREE LOGIC
  for (let i = 0; i < barks.length; i++) {
      let currentBark = barks[i];
      let currentLeaf = leafs[i];
      let currentSapling = saplings[i]; // Find the matching sapling!
      
      let barkleft = currentBark.getBoundingClientRect().left;
      let barktop  = currentBark.getBoundingClientRect().top;

      if (Math.abs(playerx - barkleft) < 20 && Math.abs(playery - barktop) < 20) {
          
          if (currentBark.style.display !== 'none') { 
              currentBark.style.display = 'none';
              currentLeaf.style.display = 'none';

              // We don't need to move the sapling anymore, just reveal it!
              currentSapling.style.display = 'block'; 
              
              document.querySelector('#log').style.display = 'block';

              nol += 2;
              document.querySelector('#NOL').innerText = nol;
			  food += 2;
			  document.querySelector('#NOA').innerText = food;
			  document.querySelector('#apple').style.display = 'block';

              setTimeout(() => {
                  currentBark.style.display = 'block';
                  currentLeaf.style.display = 'block';
                  currentSapling.style.display = 'none'; // Hide this specific sapling
              }, 10000);
              
              break; 
          }
      }
  }
  // NPC LOGIC
 if (conversation == 0) {
    if (
	Math.abs(playerx - npcleft) < 30 &&
	Math.abs(playery - npctop) < 30
	) {
        if (el == 1) {
          conversation = 1; 
          ttnpc.style.display = 'block';
          document.getElementById('NOL').innerText = nol;
          setTimeout(() => {			
            npc.style.left = 630 + "px";
            npc.style.top = 111 + "px";
			nol += 89;
			document.getElementById('NOL').innerText = nol;
          }, 7000);
        } else if (el == 0) { 
          ttnpc2.style.display = 'block';
        }
      }
    }

  // SHELTER LOGIC
   if (shelter == 0) {
    if (playerx < 550 && playerx > 490) {
      if (playery < 441 && playery > 111) { 
        if (nol >= 50) {
          nol -= 50;
          document.getElementById('NOL').innerText = nol;
          el += 1;
          document.getElementById('shelter').style.width = '120px';
        } else if (nol < 50) {
          document.getElementById('nel').style.display = 'block';	
        }	
      }
    }
  }
  //ship LOGIC
   if (playery < 481 && playery > 451) {
    if ( playerx > 461 && playerx < 541) {
		if (nol >= 100) {
		nol -= 100;
		document.querySelector('#NOL').innerText = nol;
		document.querySelector('#ship').style.width = '180px';
		document.querySelector('.NPC').style.left = '570px';
		document.querySelector('.NPC').style.top = '521px';
		as = 1
		document.querySelector('.player').style.top = '521px'
		document.querySelector('.player').style.left = '540px';
		setTimeout(() => {
		level2()
		}, 10000);
	  }
	}
  }

}

function eat() {
	const hunger = document.querySelector('#NOH');
	const apple = document.querySelector('#NOA');
	if (food > 0) {
		if (hungerjs < 96) {
	food -= 1;
	apple.innerText = food;
	hungerjs += 5;
	hunger.innerText = hungerjs;
		}
	}
}

 function devtools() {
	const playerx = document.querySelector('.player').getBoundingClientRect().left
	const playery = document.querySelector('.player').getBoundingClientRect().top
	document.getElementById('cheatcode').style.display = 'block'
	document.querySelector('#cheatbutton').style.display = 'block'
	console.log(playerx)
	console.log(playery)
	as = 1;
}

function cheatdonebutton() {
	const cheatcode = document.getElementById('cheatcode');
	if (cheatcode.value == "logasdfghjkl;'") {
		nol += 100;
		document.querySelector('#NOL').innerText = nol;
		document.querySelector('#log').style.display = 'block';
	}
}

function level2() {
    // Hide the island and shelter
    document.querySelector('#island').style.display = 'none';
    document.querySelector('#shelter').style.display = 'none';
	document.querySelector('#stone').style.display = 'none';
	
    // Hide all bark elements (including clones since querySelectorAll targets all matches)
    const barks = document.querySelectorAll('.bark');
    barks.forEach(bark => {
        bark.style.display = 'none';
    });

    // Hide all leaf elements (including clones)
    const leafs = document.querySelectorAll('.leaf');
    leafs.forEach(leaf => {
        leaf.style.display = 'none';
    });
	
	setTimeout(() => {
		l2 += 1;
		document.querySelector('.player').style.top = '200px';
		document.querySelector('.NPC').style.top = '200px';
		document.querySelector('#ship').style.top = '190px';
	}, 2000);
	
	setTimeout(() => {
	fl2()
	}, 10000);
}

function fl2() {
	document.querySelector('#kraken').style.top = '180px';
	document.querySelector('#kraken').style.left = '480px';
	//next is the kraken's tenticals
}