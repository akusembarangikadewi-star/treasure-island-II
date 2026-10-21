/* --- GAME ENGINE & STATE VARIABLES --- */
        let x = 600; 
        let y = 200;
        let conversation = 0;
        let nol = 0; // Number Of Logs
        let shelter = 0;
        let el = 0; // Enough Logs
        let ship = 0;
        let as = 0; // Aboard Ship
        let ts = 0; // tree sapling
        let hungerjs = 100;
        let healthjs = 100;
        let HR = false; // Hunger Running flag
        let food = 0; // Food count
        let l2 = 0; // Level 2 state

        // Trees positions & status
        let trees = [
            { x: 710, y: 120, chopped: false },
            { x: 740, y: 120, chopped: false },
            { x: 770, y: 120, chopped: false }
        ];

        // NPC Position
        let npcX = 680;
        let npcY = 180;

        // Kraken Boss State
        let krakenHp = 100;
        let krakenX = 650;
        let krakenY = 250;
        let krakenActive = false;
        let tentacles = [];
        let krakenAttackTimer = null;

        // Canvas Setup
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        function resizeCanvas() {
            canvas.width = 900;
            canvas.height = 506;
        }
        resizeCanvas();

        /* --- MOVEMENT LOGIC --- */
        function moveleft() {
            const step = 12;
            x -= step;
            if (as === 0 && x < 500) {
                x += step;
            }
        }

        function moveright() {
            const step = 12;
            x += step;
            if (x > 800) {
                x -= step;
            }
        }

        function moveup() {
            const step = 12;
            y -= step;
            if (y < 51) {
                y += step;
            }
        }

        function movedown() {
            const step = 12;
            y += step;
            if (as === 0 && y > 461) {
                y -= step;
            }
        }

        /* --- CONTROLS LISTENERS --- */
        document.addEventListener("keydown", function(event) {
            switch (event.key) {
                case "ArrowUp":
                case "w":
                case "W":
                    moveup();
                    break;
                case "ArrowDown":
                case "s":
                case "S":
                    movedown();
                    break;
                case "ArrowLeft":
                case "a":
                case "A":
                    moveleft();
                    break;
                case "ArrowRight":
                case "d":
                case "D":
                    moveright();
                    break;
                case "i":
                case "I":
                    interaction();
                    break;
                case "x":
                case "X":
                    closeText();
                    break;  
                case "c":
                case "C":
                    boardShipAction();
                    break;
                case "e":
                case "E":
                    eat();
                    break;
                case " ":
                    attackKraken();
                    break;
                case "Enter":
                    cheatdonebutton();
                    break;
            }
        });

        /* --- UI & HUD LOGIC --- */
        function updateUI() {
            document.getElementById('NOL').innerText = nol;
            document.getElementById('NOA').innerText = food;
            document.getElementById('NOH').innerText = hungerjs;
            document.getElementById('NOHE').innerText = healthjs;

            document.getElementById('hpBar').style.width = Math.max(0, healthjs) + '%';
            document.getElementById('hungerBar').style.width = Math.max(0, hungerjs) + '%';

            if (l2 === 1) {
                document.getElementById('krakenBarContainer').style.display = 'flex';
                document.getElementById('krakenHpBar').style.width = Math.max(0, krakenHp) + '%';
                document.getElementById('krakenHpText').innerText = Math.max(0, krakenHp) + '%';
            }
        }

        function closeText() {
            if (x >= 550 && x <= 650 && y >= 150 && y <= 250) {
                document.querySelector('#start').classList.add('hidden'); 
                if (!HR) {
                    startHunger(); 
                    HR = true;
                }
            } 

            if (conversation === 1) {
                document.querySelector('#ttnpc1').classList.add('hidden');
            }
            if (nol < 100) {
                document.querySelector('#ttnpc2').classList.add('hidden');
                document.querySelector('#nel').style.display = 'none';
            }
        }

        /* --- TIMERS & SURVIVAL MECHANICS --- */
        let hungerInterval = null;
        let healthInterval = null;

        function startHunger() {
            hungerInterval = setInterval(() => {
                if (hungerjs > 0) {
                    hungerjs -= 1;
                } else {
                    if (!healthInterval) startHealth();
                }
                updateUI();
            }, 3000);
        }

        function startHealth() {
            healthInterval = setInterval(() => {
                if (hungerjs <= 0) {
                    healthjs -= 10;
                    updateUI();
                    if (healthjs <= 0) {
                        clearInterval(healthInterval);
                        clearInterval(hungerInterval);
                        showGameOver("Starvation claimed your life on the island!");
                    }
                }
            }, 1000);
        }

        function eat() {
            if (food > 0 && hungerjs < 100) {
                food -= 1;
                hungerjs = Math.min(100, hungerjs + 15);
                updateUI();
            }
        }

        function boardShipAction() {
            if (ship === 1 && el === 1) {
                as = 1;
            }
        }

        /* --- INTERACTION SYSTEM --- */
        function interaction() {
            const playerx = x;
            const playery = y;

            // 1. TREE LOGIC
            for (let i = 0; i < trees.length; i++) {
                let tree = trees[i];
                if (Math.abs(playerx - tree.x) < 35 && Math.abs(playery - tree.y) < 35) {
                    if (!tree.chopped) { 
                        tree.chopped = true;
                        nol += 2;
                        food += 2;
                        updateUI();

                        setTimeout(() => {
                            tree.chopped = false;
                        }, 10000);
                        return; 
                    }
                }
            }

            // 2. NPC LOGIC
            if (conversation === 0) {
                if (Math.abs(playerx - npcX) < 45 && Math.abs(playery - npcY) < 45) {
                    if (el === 1) {
                        conversation = 1; 
                        document.querySelector('#ttnpc1').classList.remove('hidden');
                        setTimeout(() => {          
                            npcX = 630;
                            npcY = 111;
                            nol += 89;
                            updateUI();
                        }, 2000);
                    } else { 
                        document.querySelector('#ttnpc2').classList.remove('hidden');
                    }
                    return;
                }
            }

            // 3. SHELTER LOGIC
            if (shelter === 0) {
                if (playerx < 560 && playerx > 480 && playery < 441 && playery > 111) { 
                    if (nol >= 50) {
                        nol -= 50;
                        shelter = 1;
                        el += 1;
                        updateUI();
                    } else {
                        document.getElementById('nel').style.display = 'block'; 
                    }
                    return;
                }
            }

            // 4. SHIP LOGIC
            if (playery > 420 && playery < 485 && playerx > 460 && playerx < 560) {
                if (nol >= 100 && ship === 0) {
                    nol -= 100;
                    ship = 1;
                    as = 1;
                    npcX = 570;
                    npcY = 460;
                    y = 460;
                    x = 540;
                    updateUI();

                    setTimeout(() => {
                        level2();
                    }, 3000);
                }
            }
        }

        /* --- LEVEL 2 & KRAKEN BOSS FIGHT --- */
        function level2() {
            l2 = 1;
            document.getElementById('attackBtn').classList.remove('hidden');

            setTimeout(() => {
                x = 350;
                y = 250;
                npcX = 380;
                npcY = 250;
                updateUI();
            }, 1500);

            setTimeout(() => {
                fl2();
            }, 4000);
        }

        function fl2() {
            krakenActive = true;
            krakenX = 650;
            krakenY = 250;
            
            tentacles = [
                { x: 580, y: 150 },
                { x: 620, y: 350 },
                { x: 720, y: 180 },
                { x: 740, y: 320 }
            ];

            krakenAttackTimer = setInterval(() => {
                if (krakenActive && healthjs > 0) {
                    healthjs -= 8;
                    updateUI();
                    if (healthjs <= 0) {
                        showGameOver("The Kraken smashed your ship into pieces!");
                    }
                }
            }, 3500);
        }

        function attackKraken() {
            if (l2 === 1 && krakenActive && krakenHp > 0) {
                krakenHp -= 12;
                updateUI();

                if (krakenHp <= 0) {
                    krakenActive = false;
                    clearInterval(krakenAttackTimer);
                    document.getElementById('victoryModal').classList.remove('hidden');
                }
            }
        }

        /* --- DEV TOOLS & HELP MODAL --- */
        function toggleDevTools() {
            const dev = document.getElementById('devModal');
            dev.style.display = (dev.style.display === 'flex') ? 'none' : 'flex';
        }

        function toggleHelpModal() {
            const help = document.getElementById('helpModal');
            help.style.display = (help.style.display === 'flex') ? 'none' : 'flex';
        }

        function cheatdonebutton() {
            const cheatcode = document.getElementById('cheatcode').value;
            if (cheatcode === "logasdfghjkl;'" || cheatcode === "logs") {
                nol += 100;
                updateUI();
            } else if (cheatcode === "god") {
                healthjs = 999;
                hungerjs = 999;
                updateUI();
            } else if (cheatcode === "ship") {
                nol = 200;
                el = 1;
                updateUI();
            }
            toggleDevTools();
        }

        function showGameOver(reason) {
            document.getElementById('gameOverReason').innerText = reason;
            document.getElementById('gameOverModal').classList.remove('hidden');
        }

        /* --- CANVAS RENDER LOOP --- */
        function drawScene() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (l2 === 0) {
                // LEVEL 1: ISLAND SCENE
                ctx.fillStyle = "#0369a1";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Island Sand
                ctx.fillStyle = "#fde047";
                ctx.beginPath();
                ctx.ellipse(650, 260, 220, 180, 0, 0, Math.PI * 2);
                ctx.fill();

                // Island Grass
                ctx.fillStyle = "#15803d";
                ctx.beginPath();
                ctx.ellipse(650, 260, 190, 150, 0, 0, Math.PI * 2);
                ctx.fill();

                // Shelter Area
                if (shelter === 1) {
                    ctx.fillStyle = "#78350f";
                    ctx.fillRect(500, 200, 60, 50);
                    ctx.fillStyle = "#b45309";
                    ctx.beginPath();
                    ctx.moveTo(490, 200);
                    ctx.lineTo(530, 160);
                    ctx.lineTo(570, 200);
                    ctx.fill();
                } else {
                    ctx.strokeStyle = "#f59e0b";
                    ctx.setLineDash([4, 4]);
                    ctx.strokeRect(500, 200, 60, 50);
                    ctx.setLineDash([]);
                }

                // Trees
                trees.forEach(t => {
                    if (!t.chopped) {
                        ctx.fillStyle = "#78350f";
                        ctx.fillRect(t.x - 4, t.y, 8, 20);
                        ctx.fillStyle = "#22c55e";
                        ctx.beginPath();
                        ctx.arc(t.x, t.y - 5, 16, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.fillStyle = "#ef4444";
                        ctx.beginPath();
                        ctx.arc(t.x - 5, t.y - 5, 3, 0, Math.PI * 2);
                        ctx.arc(t.x + 4, t.y - 2, 3, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        ctx.fillStyle = "#a16207";
                        ctx.fillRect(t.x - 2, t.y + 10, 4, 10);
                        ctx.fillStyle = "#86efac";
                        ctx.beginPath();
                        ctx.arc(t.x, t.y + 8, 5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });

                // Ship Construction
                if (ship === 1) {
                    ctx.fillStyle = "#92400e";
                    ctx.beginPath();
                    ctx.arc(520, 460, 30, 0, Math.PI);
                    ctx.fill();
                    ctx.fillRect(518, 410, 4, 50);
                    ctx.fillStyle = "#f8fafc";
                    ctx.fillRect(522, 415, 20, 25);
                }

                // NPC Drawing
                ctx.fillStyle = "#38bdf8";
                ctx.beginPath();
                ctx.arc(npcX, npcY, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#fde047";
                ctx.beginPath();
                ctx.moveTo(npcX - 10, npcY - 8);
                ctx.lineTo(npcX, npcY - 24);
                ctx.lineTo(npcX + 10, npcY - 8);
                ctx.fill();

            } else {
                // LEVEL 2: OPEN SEA & KRAKEN
                ctx.fillStyle = "#0c4a6e";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.strokeStyle = "#0284c7";
                ctx.lineWidth = 2;
                const time = Date.now() * 0.003;
                for (let i = 0; i < 6; i++) {
                    ctx.beginPath();
                    for (let j = 0; j < canvas.width; j += 20) {
                        ctx.lineTo(j, 80 + i * 70 + Math.sin(time + j * 0.02) * 8);
                    }
                    ctx.stroke();
                }

                // Player Ship
                ctx.fillStyle = "#78350f";
                ctx.beginPath();
                ctx.ellipse(x, y, 45, 25, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#b45309";
                ctx.fillRect(x - 30, y - 10, 60, 20);
                ctx.fillStyle = "#f8fafc";
                ctx.fillRect(x - 5, y - 35, 20, 25);
                ctx.fillStyle = "#475569";
                ctx.fillRect(x - 7, y - 40, 4, 40);

                // NPC on Ship
                ctx.fillStyle = "#38bdf8";
                ctx.beginPath();
                ctx.arc(npcX, npcY, 8, 0, Math.PI * 2);
                ctx.fill();

                // Kraken Boss
                if (krakenActive) {
                    const kWave = Math.sin(Date.now() * 0.005) * 10;
                    
                    tentacles.forEach((ten, idx) => {
                        ctx.strokeStyle = "#991b1b";
                        ctx.lineWidth = 12;
                        ctx.beginPath();
                        ctx.moveTo(ten.x, ten.y + kWave);
                        ctx.quadraticCurveTo(ten.x + 30, ten.y - 40 + kWave, ten.x + Math.sin(time + idx) * 20, ten.y - 60 + kWave);
                        ctx.stroke();
                    });

                    ctx.fillStyle = "#7f1d1d";
                    ctx.beginPath();
                    ctx.ellipse(krakenX, krakenY + kWave, 50, 65, 0, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = "#facc15";
                    ctx.beginPath();
                    ctx.arc(krakenX - 18, krakenY - 10 + kWave, 8, 0, Math.PI * 2);
                    ctx.arc(krakenX + 18, krakenY - 10 + kWave, 8, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = "#000000";
                    ctx.beginPath();
                    ctx.arc(krakenX - 18, krakenY - 10 + kWave, 3, 0, Math.PI * 2);
                    ctx.arc(krakenX + 18, krakenY - 10 + kWave, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // PLAYER CHARACTER
            ctx.fillStyle = "#ef4444";
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#fca5a5";
            ctx.beginPath();
            ctx.arc(x, y - 4, 6, 0, Math.PI * 2);
            ctx.fill();

            requestAnimationFrame(drawScene);
        }

        window.onload = function() {
            updateUI();
            drawScene();
        };
