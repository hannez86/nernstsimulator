// Nernst-Gleichung Simulator
// Moderne JavaScript-Implementation

// Konstanten
const NERNST_FACTOR = 0.059; // 0.059 V bei 25°C (für lg, Basis 10)
const LEVEL_DESCRIPTIONS = {
    0: "Einführung - Alle Funktionen verfügbar",
    1: "Identifikation - Finde die richtige Kombination",
    2: "Standardpotential berechnen",
    3: "Nicht-ideale Lösungen berücksichtigen",
    4: "Whodatium-Standardpotential bestimmen",
    5: "Aktivitätskoeffizienten berechnen",
    6: "Aktivitätsreihe bestimmen"
};

// Metall-Datenbank
const metals = [
    {
        name: "Wasserstoff",
        symbol: "H₂",
        formula: "H₂(g)",
        M: 63,
        E: 0.000,
        A: -1.071,
        B: 1.236,
        C: -0.651,
        D: 0.1633,
        F: 0,
        color: "#e3f2fd",
        electrodeColor: "default",
        n: 1
    },
    {
        name: "Silber",
        symbol: "Ag",
        formula: "Ag⁺",
        M: 169.87,
        E: 0.799,
        A: -1.115,
        B: 0.537,
        C: -0.363,
        D: 0.0956,
        F: 0,
        color: "#e8e8e8",
        electrodeColor: "silver",
        n: 1
    },
    {
        name: "Kupfer",
        symbol: "Cu",
        formula: "Cu²⁺",
        M: 187.56,
        E: 0.339,
        A: -3.547,
        B: 6.047,
        C: -5.716,
        D: 3.103,
        F: -0.676,
        color: "#6495ed",
        electrodeColor: "copper",
        n: 2
    },
    {
        name: "Blei",
        symbol: "Pb",
        formula: "Pb²⁺",
        M: 331.20,
        E: -0.126,
        A: -3.942,
        B: 4.65,
        C: -4.584,
        D: 2.472,
        F: -0.531,
        color: "#d3d3d3",
        electrodeColor: "default",
        n: 2
    },
    {
        name: "Nickel",
        symbol: "Ni",
        formula: "Ni²⁺",
        M: 242.72,
        E: -0.250,
        A: -3.596,
        B: 6.667,
        C: -6.776,
        D: 3.986,
        F: -0.906,
        color: "#90ee90",
        electrodeColor: "default",
        n: 2
    },
    {
        name: "Cadmium",
        symbol: "Cd",
        formula: "Cd²⁺",
        M: 236.41,
        E: -0.402,
        A: -3.601,
        B: 6.539,
        C: -6.672,
        D: 3.74,
        F: -0.837,
        color: "#fffacd",
        electrodeColor: "default",
        n: 2
    },
    {
        name: "Eisen",
        symbol: "Fe",
        formula: "Fe²⁺",
        M: 179.86,
        E: -0.440,
        A: -3.635,
        B: 6.854,
        C: -7.267,
        D: 4.404,
        F: -1.036,
        color: "#deb887",
        electrodeColor: "default",
        n: 2
    },
    {
        name: "Zink",
        symbol: "Zn",
        formula: "Zn²⁺",
        M: 189.38,
        E: -0.763,
        A: -3.526,
        B: 6.52,
        C: -6.51,
        D: 3.722,
        F: -0.837,
        color: "#c0c0c0",
        electrodeColor: "zinc",
        n: 2
    },
    {
        name: "Magnesium",
        symbol: "Mg",
        formula: "Mg²⁺",
        M: 148.32,
        E: -2.370,
        A: -3.648,
        B: 6.818,
        C: -6.745,
        D: 3.788,
        F: -0.837,
        color: "#f0f0f0",
        electrodeColor: "default",
        n: 2
    },
    {
        name: "Whodatium",
        symbol: "Wd",
        formula: "Wd²⁺",
        M: 250,
        E: -0.975,
        A: -3.648,
        B: 6.818,
        C: -6.745,
        D: 3.788,
        F: -0.837,
        color: "#ffb6c1",
        electrodeColor: "default",
        n: 2
    }
];

// Globaler State
let state = {
    leftElectrode: null,
    rightElectrode: null,
    leftSolution: null,
    rightSolution: null,
    leftConcentration: 1.00,
    rightConcentration: 1.00,
    currentLevel: 0,
    voltmeterActive: false
};

// DOM-Elemente
const elements = {
    electrodeLeft: document.getElementById('electrode-left'),
    electrodeRight: document.getElementById('electrode-right'),
    solutionLeft: document.getElementById('solution-left'),
    solutionRight: document.getElementById('solution-right'),
    concentrationLeft: document.getElementById('concentration-left'),
    concentrationRight: document.getElementById('concentration-right'),
    btnMeasure: document.getElementById('btn-measure'),
    btnNewProblem: document.getElementById('btn-new-problem'),
    levelSelect: document.getElementById('level-select'),
    voltmeter: document.getElementById('voltmeter'),
    voltageDisplay: document.getElementById('voltage-display'),
    feedback: document.getElementById('feedback'),
    questionDisplay: document.getElementById('question-display'),

    // Visual elements
    electrodeLeftVisual: document.getElementById('electrode-left-visual'),
    electrodeRightVisual: document.getElementById('electrode-right-visual'),
    solutionLeftVisual: document.getElementById('solution-left-visual'),
    solutionRightVisual: document.getElementById('solution-right-visual'),
    electrodeLabelLeft: document.getElementById('electrode-label-left'),
    electrodeLabelRight: document.getElementById('electrode-label-right'),
    ionLabelLeft: document.getElementById('ion-label-left'),
    ionLabelRight: document.getElementById('ion-label-right'),
    concLabelLeft: document.getElementById('conc-label-left'),
    concLabelRight: document.getElementById('conc-label-right'),
    potentialLabelLeft: document.getElementById('potential-label-left'),
    potentialLabelRight: document.getElementById('potential-label-right')
};

// Event Listeners
function initEventListeners() {
    elements.electrodeLeft.addEventListener('change', (e) => {
        const value = e.target.value;
        state.leftElectrode = (value !== '' && value !== null) ? parseInt(value) : null;
        console.log('Left electrode changed:', state.leftElectrode);
        updateVisualization('left');
        hideVoltmeter();
    });

    elements.electrodeRight.addEventListener('change', (e) => {
        const value = e.target.value;
        state.rightElectrode = (value !== '' && value !== null) ? parseInt(value) : null;
        console.log('Right electrode changed:', state.rightElectrode);
        updateVisualization('right');
        hideVoltmeter();
    });

    elements.solutionLeft.addEventListener('change', (e) => {
        const value = e.target.value;
        state.leftSolution = (value !== '' && value !== null) ? parseInt(value) : null;
        console.log('Left solution changed:', state.leftSolution);
        validateSolution('left');
        updateVisualization('left');
        hideVoltmeter();
    });

    elements.solutionRight.addEventListener('change', (e) => {
        const value = e.target.value;
        state.rightSolution = (value !== '' && value !== null) ? parseInt(value) : null;
        console.log('Right solution changed:', state.rightSolution);
        validateSolution('right');
        updateVisualization('right');
        hideVoltmeter();
    });

    elements.concentrationLeft.addEventListener('change', (e) => {
        // Erlaube sowohl Punkt als auch Komma als Dezimaltrennzeichen
        let inputValue = e.target.value.replace(',', '.');
        const value = parseFloat(inputValue);
        if (value >= 0.0001 && value <= 2.0) {
            state.leftConcentration = value;
            e.target.value = value.toFixed(2);
            updateVisualization('left');
            hideVoltmeter();
        } else {
            showFeedback('Konzentration muss zwischen 0.0001 und 2.0 M liegen!', 'error');
            e.target.value = state.leftConcentration.toFixed(2);
        }
    });

    elements.concentrationRight.addEventListener('change', (e) => {
        // Erlaube sowohl Punkt als auch Komma als Dezimaltrennzeichen
        let inputValue = e.target.value.replace(',', '.');
        const value = parseFloat(inputValue);
        if (value >= 0.0001 && value <= 2.0) {
            state.rightConcentration = value;
            e.target.value = value.toFixed(2);
            updateVisualization('right');
            hideVoltmeter();
        } else {
            showFeedback('Konzentration muss zwischen 0.0001 und 2.0 M liegen!', 'error');
            e.target.value = state.rightConcentration.toFixed(2);
        }
    });

    elements.btnMeasure.addEventListener('click', measureVoltage);
    elements.btnNewProblem.addEventListener('click', newProblem);
    elements.levelSelect.addEventListener('change', (e) => {
        state.currentLevel = parseInt(e.target.value);
        displayQuestion();
        newProblem();
    });

    // Swap electrodes button
    document.getElementById('swap-electrodes').addEventListener('click', swapElectrodes);

    // Links
    document.getElementById('link-potentials').addEventListener('click', (e) => {
        e.preventDefault();
        showStandardPotentials();
    });

    document.getElementById('link-about').addEventListener('click', (e) => {
        e.preventDefault();
        showAbout();
    });

    document.getElementById('link-background').addEventListener('click', (e) => {
        e.preventDefault();
        showBackground();
    });

    // Modal schließen
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
            closeModal();
        }
    });
}

// Visualisierung aktualisieren
function updateVisualization(side) {
    const electrode = side === 'left' ? state.leftElectrode : state.rightElectrode;
    const solution = side === 'left' ? state.leftSolution : state.rightSolution;
    const concentration = side === 'left' ? state.leftConcentration : state.rightConcentration;

    console.log(`UpdateVisualization (${side}):`, { electrode, solution, concentration });

    const visualElems = {
        electrode: side === 'left' ? elements.electrodeLeftVisual : elements.electrodeRightVisual,
        solution: side === 'left' ? elements.solutionLeftVisual : elements.solutionRightVisual,
        label: side === 'left' ? elements.electrodeLabelLeft : elements.electrodeLabelRight,
        ionLabel: side === 'left' ? elements.ionLabelLeft : elements.ionLabelRight,
        concLabel: side === 'left' ? elements.concLabelLeft : elements.concLabelRight,
        potentialLabel: side === 'left' ? elements.potentialLabelLeft : elements.potentialLabelRight
    };

    // Elektrode
    if (electrode !== null && electrode !== undefined) {
        const metal = metals[electrode];
        console.log(`Setting ${side} electrode to:`, metal.name);
        visualElems.label.textContent = metal.name;

        // Elektroden-Styling
        visualElems.electrode.className = 'electrode';
        if (metal.electrodeColor !== 'default') {
            visualElems.electrode.classList.add(metal.electrodeColor);
        }
        visualElems.electrode.style.display = 'block';

        // Standardpotential anzeigen (außer bei Whodatium)
        if (electrode === 9) {
            visualElems.potentialLabel.textContent = 'E° = ???';
            visualElems.potentialLabel.style.background = 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
        } else {
            visualElems.potentialLabel.textContent = `E° = ${metal.E.toFixed(3)} V`;
            visualElems.potentialLabel.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    } else {
        console.log(`${side} electrode cleared`);
        visualElems.label.textContent = 'Keine Elektrode';
        visualElems.electrode.style.display = 'none';
        visualElems.potentialLabel.textContent = '-';
    }

    // Lösung
    if (solution !== null && solution !== undefined) {
        const solutionMetal = metals[solution];
        visualElems.ionLabel.textContent = solutionMetal.formula;
        visualElems.concLabel.textContent = `${concentration.toFixed(2)} M`;

        // Farbe basierend auf Konzentration anpassen
        const baseColor = solutionMetal.color;
        const adjustedColor = adjustColorIntensity(baseColor, concentration);
        visualElems.solution.style.backgroundColor = adjustedColor;
    } else {
        visualElems.ionLabel.textContent = '-';
        visualElems.concLabel.textContent = '-';
        visualElems.solution.style.backgroundColor = '#a8d8ea';
    }

    // Blasen für Wasserstoff-Elektrode
    if (electrode === 0) {
        createBubbles(visualElems.solution);
    }
}

// Farbe basierend auf Konzentration anpassen
function adjustColorIntensity(hexColor, concentration) {
    // Konvertiere Hex zu RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Mische mit Weiß basierend auf Konzentration (2.0 M = volle Farbe, 0.0001 M = fast transparent)
    const factor = Math.min(concentration / 2.0, 1.0);
    const newR = Math.round(255 - (255 - r) * factor);
    const newG = Math.round(255 - (255 - g) * factor);
    const newB = Math.round(255 - (255 - b) * factor);

    return `rgb(${newR}, ${newG}, ${newB})`;
}

// Blasen für Wasserstoff-Elektrode erstellen
function createBubbles(container) {
    // Entferne alte Blasen
    const oldBubbles = container.querySelectorAll('.bubble');
    oldBubbles.forEach(b => b.remove());

    // Erstelle neue Blasen
    setInterval(() => {
        if (container.querySelectorAll('.bubble').length < 3) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            const size = 5 + Math.random() * 10;
            bubble.style.width = size + 'px';
            bubble.style.height = size + 'px';
            bubble.style.left = (30 + Math.random() * 40) + '%';
            bubble.style.animationDuration = (1.5 + Math.random() * 1) + 's';
            container.appendChild(bubble);

            setTimeout(() => bubble.remove(), 2500);
        }
    }, 800);
}

// Lösung validieren (Kation muss zur Elektrode passen)
function validateSolution(side) {
    const electrode = side === 'left' ? state.leftElectrode : state.rightElectrode;
    const solution = side === 'left' ? state.leftSolution : state.rightSolution;

    if (electrode !== null && solution !== null) {
        if (electrode !== solution) {
            showFeedback('⚠️ Warnung: Elektrode und Lösung passen nicht zusammen! Das kann zu unerwarteten Ergebnissen führen.', 'error');
            // Lösung NICHT zurücksetzen, nur warnen
        }
    }
}

// Elektroden-Potential berechnen (vereinfacht, verdünnte Lösungen)
function calculatePotential(metalIndex, concentration) {
    const metal = metals[metalIndex];
    let E = metal.E;

    if (concentration > 0) {
        // Vereinfachte Nernst-Gleichung: E = E° + (0.059V/z) * lg(c)
        // z ist die Anzahl der übertragenen Elektronen (1 oder 2)
        const z = metal.n === 1 ? 1 : 2;
        E += (NERNST_FACTOR / z) * Math.log10(concentration);
    }

    return E;
}

// Zellspannung messen
function measureVoltage() {
    console.log('=== Measuring Voltage ===');
    console.log('State:', JSON.stringify(state, null, 2));
    console.log('Left electrode:', state.leftElectrode, 'type:', typeof state.leftElectrode);
    console.log('Right electrode:', state.rightElectrode, 'type:', typeof state.rightElectrode);
    console.log('Left solution:', state.leftSolution, 'type:', typeof state.leftSolution);
    console.log('Right solution:', state.rightSolution, 'type:', typeof state.rightSolution);

    // Validierung
    if (state.leftElectrode === null || state.rightElectrode === null ||
        state.leftElectrode === undefined || state.rightElectrode === undefined) {
        console.log('Missing electrode(s)');
        console.log('Left electrode is null/undefined:', state.leftElectrode === null || state.leftElectrode === undefined);
        console.log('Right electrode is null/undefined:', state.rightElectrode === null || state.rightElectrode === undefined);
        showFeedback('Bitte wähle beide Elektroden!', 'error');
        return;
    }

    if (state.leftSolution === null || state.rightSolution === null ||
        state.leftSolution === undefined || state.rightSolution === undefined) {
        console.log('Missing solution(s)');
        console.log('Left solution is null/undefined:', state.leftSolution === null || state.leftSolution === undefined);
        console.log('Right solution is null/undefined:', state.rightSolution === null || state.rightSolution === undefined);
        showFeedback('Bitte wähle beide Lösungen!', 'error');
        return;
    }

    // Check Wasserstoff-Elektrode bei Level > 0
    if (state.currentLevel !== 0) {
        if (state.leftElectrode === 0 || state.rightElectrode === 0) {
            showFeedback('Wasserstoff-Elektrode ist nur bei Level 0 verfügbar!', 'error');
            return;
        }
    }

    // Potentiale berechnen
    const leftPotential = calculatePotential(state.leftElectrode, state.leftConcentration);
    const rightPotential = calculatePotential(state.rightElectrode, state.rightConcentration);

    console.log('Left potential:', leftPotential, 'V');
    console.log('Right potential:', rightPotential, 'V');

    // Zellspannung = Kathode - Anode
    const cellVoltage = rightPotential - leftPotential;
    console.log('Cell voltage:', cellVoltage, 'V');

    // Anzeige
    elements.voltageDisplay.textContent = cellVoltage.toFixed(3) + ' V';
    elements.voltmeter.classList.add('active');
    state.voltmeterActive = true;

    // Bestimme Anode/Kathode
    if (cellVoltage > 0) {
        showFeedback(`✓ Positive Spannung: ${cellVoltage.toFixed(3)} V`, 'success');
    } else {
        showFeedback(`Negative Spannung: ${cellVoltage.toFixed(3)} V (Elektroden vertauschen?)`, 'error');
    }
}

// Voltmeter verstecken
function hideVoltmeter() {
    elements.voltmeter.classList.remove('active');
    state.voltmeterActive = false;
}

// Feedback anzeigen
function showFeedback(message, type = 'success') {
    elements.feedback.textContent = message;
    elements.feedback.className = `feedback ${type}`;
    elements.feedback.style.display = 'block';

    setTimeout(() => {
        elements.feedback.style.display = 'none';
    }, 4000);
}

// Elektroden vertauschen
function swapElectrodes() {
    // Tausche State-Werte
    const tempElectrode = state.leftElectrode;
    const tempSolution = state.leftSolution;
    const tempConcentration = state.leftConcentration;

    state.leftElectrode = state.rightElectrode;
    state.leftSolution = state.rightSolution;
    state.leftConcentration = state.rightConcentration;

    state.rightElectrode = tempElectrode;
    state.rightSolution = tempSolution;
    state.rightConcentration = tempConcentration;

    // Tausche Select-Werte
    const tempElectrodeValue = elements.electrodeLeft.value;
    const tempSolutionValue = elements.solutionLeft.value;
    const tempConcentrationValue = elements.concentrationLeft.value;

    elements.electrodeLeft.value = elements.electrodeRight.value;
    elements.solutionLeft.value = elements.solutionRight.value;
    elements.concentrationLeft.value = elements.concentrationRight.value;

    elements.electrodeRight.value = tempElectrodeValue;
    elements.solutionRight.value = tempSolutionValue;
    elements.concentrationRight.value = tempConcentrationValue;

    // Aktualisiere Visualisierung
    updateVisualization('left');
    updateVisualization('right');
    hideVoltmeter();

    showFeedback('Elektroden vertauscht!', 'success');
}

// Neue Aufgabe generieren
function newProblem() {
    // Reset
    state.leftElectrode = null;
    state.rightElectrode = null;
    state.leftSolution = null;
    state.rightSolution = null;
    state.leftConcentration = 1.00;
    state.rightConcentration = 1.00;

    elements.electrodeLeft.value = '';
    elements.electrodeRight.value = '';
    elements.solutionLeft.value = '';
    elements.solutionRight.value = '';
    elements.concentrationLeft.value = '1.00';
    elements.concentrationRight.value = '1.00';

    hideVoltmeter();
    updateVisualization('left');
    updateVisualization('right');

    // Whodatium neu generieren bei Level 4
    if (state.currentLevel === 4) {
        generateRandomWhodatium();
    }

    showFeedback('Neue Aufgabe geladen!', 'success');
}

// Zufälliges Whodatium generieren
function generateRandomWhodatium() {
    const wd = metals[9];

    // Zufälliges Standardpotential zwischen -1.0 und +1.0 V
    const sign = Math.random() > 0.5 ? 1 : -1;
    wd.E = sign * (Math.random() * 1.0);

    // Zufällige Parameter von anderen Metallen
    const randomMetal = metals[Math.floor(1 + Math.random() * 8)];
    wd.A = randomMetal.A;
    wd.B = randomMetal.B;
    wd.C = randomMetal.C;
    wd.D = randomMetal.D;
    wd.F = randomMetal.F;
    wd.M = randomMetal.M;

    // Zufällige Farbe
    const colors = ['#ffb6c1', '#fffacd', '#f0f0f0', '#e8e8e8', '#d3d3d3', '#c0c0c0'];
    wd.color = colors[Math.floor(Math.random() * colors.length)];

    console.log('Whodatium generated:', wd);
}

// Modal-Funktionen
function showModal(content) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = content;
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
}

// Standardpotentiale anzeigen
function showStandardPotentials() {
    let tableHTML = '<h2>Standardpotentiale (E°) bei 25°C</h2><table>';
    tableHTML += '<tr><th>Metall</th><th>Reaktion</th><th>E° (V)</th></tr>';

    metals.slice(0, 9).forEach(metal => {
        const reaction = metal.n === 1
            ? `${metal.symbol}⁺ + e⁻ → ${metal.symbol}(s)`
            : `${metal.symbol}²⁺ + 2e⁻ → ${metal.symbol}(s)`;

        tableHTML += `<tr><td>${metal.name}</td><td>${reaction}</td><td style="text-align:center;">${metal.E.toFixed(3)}</td></tr>`;
    });

    tableHTML += '</table>';
    showModal(tableHTML);
}

// Über die Simulation
function showAbout() {
    const aboutText = `
        <h2>Über diese Simulation</h2>
        <p>Diese interaktive Simulation wurde entwickelt, um das Verständnis elektrochemischer Zellen und der Nernst-Gleichung zu fördern.</p>

        <h3>Features:</h3>
        <ul>
            <li>9 verschiedene Elektroden-Metalle</li>
            <li>Variable Konzentrationen (0.0001 - 2.0 M)</li>
            <li>Vereinfachte Nernst-Gleichung für verdünnte Lösungen</li>
            <li>4 Schwierigkeitsstufen</li>
            <li>Realistische Visualisierung</li>
        </ul>

        <h3>Credits:</h3>
        <p>Die Idee wurde inspiriert von einer Simulation von Gary L. Bertrand, University of Missouri-Rolla, die leider nicht mehr verfügbar ist. <br /> <br />
        Neu entwickelt und erweitert mit HTML5, CSS3 und JavaScript von <a href="https://www.hsander.net" target="_blank" rel="noopener noreferrer">Hannes Sander</a>.</p>

        <div style="margin-top: 12px; display:flex; align-items:center; gap:10px;">
            <img src="https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-sa.png" width="88" height="31" alt="CC BY-SA" loading="lazy" />
            <span>Lizenz: <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a></span>
        </div>
    `;

    showModal(aboutText);
}

// Hintergrundinformationen
function showBackground() {
    const backgroundText = `
        <h2>Elektrochemische Zellen</h2>

        <h3>Die Nernst-Gleichung (vereinfachte Form)</h3>
        <p>Die Nernst-Gleichung beschreibt, wie das Elektrodenpotential von der Konzentration der Ionen abhängt:</p>
        <p style="text-align:center; font-size:1.4em; font-style:italic; background:#f0f0f0; padding:15px; border-radius:8px;">
            E = E° + (0,059 V / z) · lg(c)
        </p>
        <p>Dabei ist:</p>
        <ul>
            <li><b>E</b>: Elektrodenpotential in Volt</li>
            <li><b>E°</b>: Standardpotential in Volt</li>
            <li><b>z</b>: Anzahl übertragener Elektronen (1 oder 2)</li>
            <li><b>c</b>: Konzentration der Ionen in mol/L</li>
            <li><b>lg(c)</b>: dekadischer Logarithmus (Basis 10)</li>
            <li><b>0,059 V</b>: Vereinfachter Faktor bei 25°C</li>
        </ul>

        <p><b>Hinweis:</b> Diese vereinfachte Form gilt für verdünnte Lösungen bei 25°C,
        wo die Aktivitätskoeffizienten γ ≈ 1 sind.</p>

        <h3>Galvanische Zelle</h3>
        <p>Eine galvanische Zelle besteht aus zwei Halbzellen:</p>
        <ul>
            <li><b>Anode</b>: Elektrode mit niedrigerem Potential (Oxidation)</li>
            <li><b>Kathode</b>: Elektrode mit höherem Potential (Reduktion)</li>
            <li><b>Salzbrücke</b>: Verbindet die Lösungen und ermöglicht Ionenfluss</li>
        </ul>

        <p>Die Zellspannung berechnet sich als:</p>
        <p style="text-align:center; font-size:1.2em; font-style:italic;">
            E<sub>Zelle</sub> = E<sub>Kathode</sub> - E<sub>Anode</sub>
        </p>
    `;

    showModal(backgroundText);
}

// M1-Auswertungshilfe für die Konzentrationsaufgabe
function showM1Guide() {
    const guideText = `
        <h2>M1: Auswertung der Konzentrationsabhängigkeit</h2>
        <p>Nutze diese Schritte, um deine Messwerte systematisch auszuwerten. Ergänze fehlende Teile sinnvoll.</p>

        <ol style="text-align: left; margin-left: 20px;">
            <li>Stelle den Term für die Situation mit Lösungen gleicher Konzentration unter
            Standardbedingungen auf.</li>
            <li>Die verdünntere Zelle bildet die Anode (was bedeutet das für die ablaufende Reaktion?).
            Das Potential der Anode hat nun also einen anderen Wert. Korrigiere in der in a) entwickelten
            Gleichung den Term für die Anode um einen noch zu bestimmenden Korrekturfaktor.</li>
            <li>Achtung: Du berechnest nun die Zellspannung <b>U</b> – und nicht mehr die
            Standardzellspannung <b>U</b><sub>0</sub>!</li>
            <li>Betrachte nun die Werte aus den Experimenten genau. Du kannst erkennen, dass sich
            die Spannung des galvanischen Elements bei jeder Verdünnung auf 1/10 um den gleichen Faktor ändert.
            Bestimme diesen Faktor für jedes deiner Experimente!</li>
            <li>Begründe anhand deiner Messwerte, dass die gefundenen Ausdrücke deine Messergebnisse
            sinnvoll beschreiben.
                <div class="equation-block" aria-label="M1 Gleichungen für Silber und Kupfer">
                    <div class="equation-line">
                        <span class="eq">U</span>(Silberzelle) =
                        <span class="eq">E</span><sup>°</sup>(Kathode) − {<span class="eq">E</span><sup>°</sup>(Anode) − 0,060 V · Anzahl der 1/10‑Verdünnungen}
                    </div>
                    <div class="equation-line">
                        <span class="eq">U</span>(Kupferzelle) =
                        <span class="eq">E</span><sup>°</sup>(Kathode) − {<span class="eq">E</span><sup>°</sup>(Anode) − 0,030 V · Anzahl der 1/10‑Verdünnungen}
                    </div>
                </div>
            </li>
            <li>Erkläre, dass die „Anzahl der 1/10‑Verdünnungen“ sich gut über den negativen
            Logarithmus zur Basis 10 der Konzentration des Elektrolyten ausdrücken lässt.</li>
            <li>Überlege als letzten Schritt, weshalb der Korrekturterm für Silber‑ und Kupferzelle
            unterschiedlich ist. Daraus ergibt sich der Zusammenhang für die Abhängigkeit des Elektrodenpotentials
            von der Konzentration – die (vereinfachte) Nernst‑Gleichung.
                <div class="equation-block" aria-label="Nernst-Gleichung">
                    <div class="equation-line equation-nernst">
                        <span class="eq">E</span> = <span class="eq">E</span><sup>°</sup>(Me|Me<sup>z+</sup>) +
                        (0,059 V / <span class="eq">z</span>) · lg <span class="eq">c</span>(Me<sup>z+</sup>)
                    </div>
                </div>
            </li>
        </ol>
    `;

    showModal(guideText);
}

// Frage für aktuelles Level anzeigen
function displayQuestion() {
    const level = state.currentLevel;
    let questionHTML = '';

    switch(level) {
        case 0:
            // Level 0: Einführung - Vertraut machen mit der Simulation
            questionHTML = `
                <h3>Level 0: Einführung - Erste Schritte</h3>
                <p><strong>Willkommen!</strong> Mache dich mit der Simulation vertraut:</p>
                <ol style="text-align: left; margin-left: 20px;">
                    <li>Wähle zwei verschiedene Elektroden (links und rechts)</li>
                    <li>Wähle die passenden Lösungen (z.B. Kupfer-Elektrode → Kupfer(II)-nitrat)</li>
                    <li>Klicke auf "Zellspannung messen"</li>
                    <li>Beobachte, wie sich die Spannung ändert, wenn du die Konzentrationen anpasst</li>
                </ol>
                <p><strong>Tipp:</strong> Probiere verschiedene Kombinationen aus! Je größer der Unterschied
                zwischen den Standardpotentialen, desto höher die Zellspannung.</p>
            `;
            break;

        case 1:
            // Level 1: Identifikation - Elektroden anhand der Spannung identifizieren
            questionHTML = `
                <h3>Level 1: Elektrodenidentifikation</h3>
                <p>Aufgabe: Wähle beide Elektroden und Lösungen aus und messe die Zellspannung.
                Identifiziere dann anhand der gemessenen Spannung, welche Elektrode die Anode und welche die Kathode ist.</p>
                <p><strong>Tipp:</strong> Bei positiver Spannung ist die linke Elektrode die Anode (niedriges Potential)
                und die rechte die Kathode (hohes Potential).</p>
                <button class="btn" onclick="checkElectrodeIdentification()">Antwort prüfen</button>
            `;
            break;

        case 2:
            // Level 2: Standardpotential berechnen
            questionHTML = `
                <h3>Level 2: Standardpotential der Zelle</h3>
                <p>Aufgabe: Wähle zwei verschiedene Elektroden und stelle beide Konzentrationen auf 1.00 M ein.
                Messe dann die Zellspannung.</p>
                <p><strong>Hintergrund:</strong> Bei Standardbedingungen (c = 1.00 M, 25°C) entspricht die gemessene
                Zellspannung dem Standardpotential E°<sub>Zelle</sub> = E°<sub>Kathode</sub> - E°<sub>Anode</sub>.</p>
                <p><strong>Beispiel:</strong> Cu/Zn-Zelle → E° = E°(Cu²⁺/Cu) - E°(Zn²⁺/Zn) = 0.339 - (-0.763) = 1.102 V</p>
                <button class="btn" onclick="checkStandardPotential()">Antwort prüfen</button>
            `;
            break;

        case 3:
            // Level 3: Whodatium - Bestimme das Standardpotential
            questionHTML = `
                <h3>Level 3: Whodatium-Potential bestimmen</h3>
                <p>Aufgabe: Whodatium (Wd) ist ein fiktives Element. Bestimme sein Standardpotential E°,
                indem du es mit bekannten Elektroden kombinierst und die Zellspannung misst.</p>
                <p><strong>Strategie:</strong> Baue mehrere Zellen mit Whodatium und bekannten Elektroden.
                Aus E<sub>Zelle</sub> = E<sub>Kathode</sub> - E<sub>Anode</sub> kannst du E°<sub>Wd</sub> berechnen.</p>
                <button class="btn" onclick="checkWhodatium()">Antwort prüfen</button>
            `;
            break;

        case 4:
            // Level 4: Konzentrationsänderung - Systematische Untersuchung
            questionHTML = `
                <h3>Level 4: Konzentrationseinfluss (systematisch)</h3>
                <p>Aufgabe: Untersuche systematisch den Einfluss der Konzentration auf die Zellspannung.</p>
                <p><strong>Teil A:</strong> Wähle eine galvanische Zelle (z.B. Cu/Zn). Halte die Konzentration in einer Halbzelle konstant
                und variiere die andere über mehrere Zehnerpotenzen.</p>
                <ul style="text-align: left; margin-left: 20px;">
                    <li>Konstant: c = 1.00 M</li>
                    <li>Variabel: 1.00 M → 0.10 M → 0.01 M → 0.001 M</li>
                </ul>
                <p><strong>Teil B:</strong> Wiederhole die Untersuchung als Konzentrationselement mit zwei Silberhalbzellen (Ag/Ag⁺).</p>
                <p><strong>Auswertung:</strong> Betrachte deine Messwerte genau. Folge der Anleitung in M1 Schritt für Schritt
                und ergänze fehlende Teile sinnvoll.</p>
                <p style="font-size: 0.9em; color: #666;"><strong>Tipp:</strong> Notiere jede Messung und vergleiche die Spannung
                mit dem Konzentrationsverhältnis.</p>
                <button class="btn btn-secondary" onclick="showM1Guide()">M1‑Auswertung öffnen</button>
            `;
            break;

        default:
            elements.questionDisplay.classList.remove('active');
            return;
    }

    elements.questionDisplay.innerHTML = questionHTML;
    elements.questionDisplay.classList.add('active');
}

// Prüffunktionen für die verschiedenen Level
function checkElectrodeIdentification() {
    if (state.voltmeterActive && state.leftElectrode !== null && state.rightElectrode !== null) {
        const voltage = parseFloat(elements.voltageDisplay.textContent);
        if (voltage > 0) {
            showFeedback('✓ Richtig! Die linke Elektrode ist die Anode, die rechte ist die Kathode.', 'success');
        } else {
            showFeedback('Die Spannung ist negativ. Überlege, was das bedeutet!', 'error');
        }
    } else {
        showFeedback('Bitte erst eine Messung durchführen!', 'error');
    }
}

function checkStandardPotential() {
    if (state.leftConcentration === 1.00 && state.rightConcentration === 1.00 && state.voltmeterActive) {
        const voltage = parseFloat(elements.voltageDisplay.textContent);
        const leftMetal = metals[state.leftElectrode];
        const rightMetal = metals[state.rightElectrode];
        const theoreticalE0 = rightMetal.E - leftMetal.E;

        const diff = Math.abs(voltage - theoreticalE0);

        if (diff < 0.003) {
            showFeedback(`✓ Sehr gut! Gemessen: ${voltage.toFixed(3)} V = E°<sub>Zelle</sub>`, 'success');
        } else {
            showFeedback(`E° sollte ${theoreticalE0.toFixed(3)} V sein. Deine Messung: ${voltage.toFixed(3)} V`, 'error');
        }
    } else {
        showFeedback('Stelle beide Konzentrationen auf 1.00 M und führe eine Messung durch!', 'error');
    }
}


function checkWhodatium() {
    if (state.voltmeterActive && (state.leftElectrode === 9 || state.rightElectrode === 9)) {
        const voltage = parseFloat(elements.voltageDisplay.textContent);
        const whodatiumE = metals[9].E;

        let calculatedE;
        if (state.leftElectrode === 9) {
            // Whodatium ist Anode
            const knownE = metals[state.rightElectrode].E;
            calculatedE = knownE - voltage;
        } else {
            // Whodatium ist Kathode
            const knownE = metals[state.leftElectrode].E;
            calculatedE = voltage + knownE;
        }

        const diff = Math.abs(calculatedE - whodatiumE);
        if (diff < 0.02) {
            showFeedback(`✓ Sehr gut! E°(Wd²⁺/Wd) ≈ ${calculatedE.toFixed(3)} V (Richtig: ${whodatiumE.toFixed(3)} V)`, 'success');
        } else {
            showFeedback(`Deine Berechnung: ${calculatedE.toFixed(3)} V. Das richtige E°(Wd) ist ${whodatiumE.toFixed(3)} V.`, 'error');
        }
    } else {
        showFeedback('Baue eine Zelle mit Whodatium und messe die Spannung!', 'error');
    }
}

function checkConcentrationCell() {
    // Prüfe, ob Konzentrationszelle aufgebaut ist
    if (state.leftElectrode === state.rightElectrode && state.leftSolution === state.rightSolution) {
        const metal = metals[state.leftElectrode];
        const metalName = metal.name;

        if (state.voltmeterActive) {
            const voltage = parseFloat(elements.voltageDisplay.textContent);
            const cLeft = state.leftConcentration;
            const cRight = state.rightConcentration;

            // Berechne theoretische Spannung mit Nernst-Gleichung
            // E = (0.059/z) * lg(c_rechts/c_links)
            const z = metal.n === 1 ? 1 : 2;
            const theoreticalVoltage = (NERNST_FACTOR / z) * Math.log10(cRight / cLeft);

            let explanation = `
                <h3>Konzentrationszelle: ${metalName}</h3>
                <p><strong>Aufbau:</strong></p>
                <ul>
                    <li>Beide Elektroden: ${metalName}</li>
                    <li>Beide Lösungen: ${metal.formula}</li>
                    <li>c<sub>links</sub> = ${cLeft.toFixed(4)} M</li>
                    <li>c<sub>rechts</sub> = ${cRight.toFixed(4)} M</li>
                </ul>

                <h4>Berechnung der Zellspannung:</h4>
                <p>Für eine Konzentrationszelle gilt:</p>
                <p style="text-align:center; font-size:1.2em; background:#f0f0f0; padding:10px; border-radius:5px;">
                    E<sub>Zelle</sub> = (0,059 V / z) · lg(c<sub>rechts</sub> / c<sub>links</sub>)
                </p>
                <p>Mit z = ${z} (Anzahl übertragener Elektronen):</p>
                <p style="text-align:center; font-size:1.1em;">
                    E<sub>Zelle</sub> = (0,059 V / ${z}) · lg(${cRight.toFixed(4)} / ${cLeft.toFixed(4)})
                </p>
                <p style="text-align:center; font-size:1.1em;">
                    E<sub>Zelle</sub> = ${(NERNST_FACTOR / z).toFixed(4)} V · lg(${(cRight / cLeft).toFixed(2)})
                </p>
                <p style="text-align:center; font-size:1.1em;">
                    E<sub>Zelle</sub> = ${(NERNST_FACTOR / z).toFixed(4)} V · ${Math.log10(cRight / cLeft).toFixed(3)}
                </p>
                <p style="text-align:center; font-size:1.3em; font-weight:bold; color:#667eea;">
                    E<sub>Zelle</sub> = ${theoreticalVoltage.toFixed(3)} V
                </p>

                <p><strong>Gemessene Spannung:</strong> ${voltage.toFixed(3)} V</p>

                <h4>Interpretation:</h4>
                <ul>
                    <li>Die Spannung entsteht nur durch den Konzentrationsunterschied</li>
                    <li>Beide Elektroden haben das gleiche E°, daher hebt sich E° heraus</li>
                    <li>Die Spannung ist proportional zu lg(c<sub>rechts</sub> / c<sub>links</sub>)</li>
                    <li>Je größer der Konzentrationsunterschied, desto größer die Spannung</li>
                </ul>
            `;

            showModal(explanation);
        } else {
            showFeedback('Bitte baue eine Konzentrationszelle auf und messe die Spannung!', 'error');
        }
    } else {
        showFeedback('Für eine Konzentrationszelle müssen beide Elektroden UND beide Lösungen identisch sein!', 'error');
    }
}


// Initialisierung
function init() {
    initEventListeners();

    // State aus vorhandenen Select-Werten initialisieren (wichtig nach Browser-Refresh!)
    const leftElectrodeValue = elements.electrodeLeft.value;
    const rightElectrodeValue = elements.electrodeRight.value;
    const leftSolutionValue = elements.solutionLeft.value;
    const rightSolutionValue = elements.solutionRight.value;

    if (leftElectrodeValue !== '' && leftElectrodeValue !== null) {
        state.leftElectrode = parseInt(leftElectrodeValue);
        console.log('Initialized left electrode from select:', state.leftElectrode);
    }
    if (rightElectrodeValue !== '' && rightElectrodeValue !== null) {
        state.rightElectrode = parseInt(rightElectrodeValue);
        console.log('Initialized right electrode from select:', state.rightElectrode);
    }
    if (leftSolutionValue !== '' && leftSolutionValue !== null) {
        state.leftSolution = parseInt(leftSolutionValue);
        console.log('Initialized left solution from select:', state.leftSolution);
    }
    if (rightSolutionValue !== '' && rightSolutionValue !== null) {
        state.rightSolution = parseInt(rightSolutionValue);
        console.log('Initialized right solution from select:', state.rightSolution);
    }

    updateVisualization('left');
    updateVisualization('right');
    generateRandomWhodatium();
    displayQuestion(); // Zeige Frage für aktuelles Level

    console.log('Nernst-Simulator initialisiert!');
    console.log('Initial State:', state);
}

// Starte die Simulation
document.addEventListener('DOMContentLoaded', init);
