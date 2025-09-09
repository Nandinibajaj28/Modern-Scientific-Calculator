let expression = '';
let history = [];
let mode = 'basic';

function updateDisplay() {
    document.getElementById('expression').textContent = expression || '';
    if (expression === '') {
        document.getElementById('result').textContent = '0';
    }
}

function addNumber(num) {
    expression += num;
    updateDisplay();
    try {
        const result = evaluateExpression(expression);
        if (!isNaN(result) && isFinite(result)) {
            document.getElementById('result').textContent = result;
        }
    } catch (e) {
        // Don't update result if expression is incomplete
    }
}

function addOperator(op) {
    if (expression !== '' || op === '(' || op === '-') {
        expression += op;
        updateDisplay();
    }
}

function addFunction(func) {
    expression += func;
    updateDisplay();
}

function addConstant(constant) {
    if (constant === 'pi') {
        expression += Math.PI.toFixed(10);
    } else if (constant === 'e') {
        expression += Math.E.toFixed(10);
    }
    updateDisplay();
}

function factorial() {
    if (expression) {
        try {
            const num = parseFloat(evaluateExpression(expression));
            if (num >= 0 && num <= 170 && Number.isInteger(num)) {
                let result = 1;
                for (let i = 2; i <= num; i++) {
                    result *= i;
                }
                expression = result.toString();
                updateDisplay();
                document.getElementById('result').textContent = result;
            }
        } catch (e) {
            // Invalid expression for factorial
        }
    }
}

function clearAll() {
    expression = '';
    updateDisplay();
}

function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
    if (expression) {
        try {
            const result = evaluateExpression(expression);
            if (!isNaN(result) && isFinite(result)) {
                document.getElementById('result').textContent = result;
            }
        } catch (e) {
            // Don't update result if expression is incomplete
        }
    }
}

function evaluateExpression(expr) {
    // Replace mathematical functions and constants
    expr = expr.replace(/sin\(/g, 'Math.sin(');
    expr = expr.replace(/cos\(/g, 'Math.cos(');
    expr = expr.replace(/tan\(/g, 'Math.tan(');
    expr = expr.replace(/log\(/g, 'Math.log10(');
    expr = expr.replace(/ln\(/g, 'Math.log(');
    expr = expr.replace(/sqrt\(/g, 'Math.sqrt(');
    expr = expr.replace(/abs\(/g, 'Math.abs(');
    expr = expr.replace(/\^/g, '**');
    
    // Use Function constructor for safe evaluation
    return Function('"use strict"; return (' + expr + ')')();
}

function calculate() {
    if (expression) {
        try {
            const result = evaluateExpression(expression);
            if (!isNaN(result) && isFinite(result)) {
                // Add to history
                history.unshift({
                    expression: expression,
                    result: result
                });
                if (history.length > 10) {
                    history.pop();
                }
                updateHistory();
                
                // Update display
                document.getElementById('result').textContent = result;
                expression = result.toString();
                document.getElementById('expression').textContent = expression;
            } else {
                document.getElementById('result').textContent = 'Error';
            }
        } catch (error) {
            document.getElementById('result').textContent = 'Error';
        }
    }
}

function updateHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.textContent = `${item.expression} = ${item.result}`;
        historyList.appendChild(div);
    });
}

function toggleMode(newMode) {
    mode = newMode;
    const buttons = document.querySelectorAll('.mode-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const scientificButtons = document.getElementById('scientificButtons');
    if (mode === 'scientific') {
        scientificButtons.classList.add('active');
    } else {
        scientificButtons.classList.remove('active');
    }
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        addNumber(e.key);
    } else if (e.key === '.') {
        addNumber('.');
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        addOperator(e.key);
    } else if (e.key === '(' || e.key === ')') {
        addOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Escape') {
        clearAll();
    } else if (e.key === 'Backspace') {
        deleteLast();
    }
});