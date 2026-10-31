function getStatColor(stat) {
    if (stat.includes(':')) return 'aqua';
    if (stat.endsWith('%')) {
        stat = parseInt(stat.slice(0, -1));
    }
    return stat > 0 ? 'green' : 'red';
}

export function createStatElement(name, min, max) {
    const container = document.createElement('p');
    const nameElement = document.createElement('span');
    nameElement.innerText = name + ': ';
    container.appendChild(nameElement);

    const minElement = document.createElement('span');
    minElement.innerText = min;
    minElement.classList.add(getStatColor(min));
    container.appendChild(minElement);

    if (max) {
        const dashElement = document.createElement('span');
        dashElement.innerText = ' - ';
        dashElement.classList.add('gray');
        container.appendChild(dashElement);
    
        const maxElement = document.createElement('span');
        maxElement.innerText = max;
        maxElement.classList.add(getStatColor(max));
        container.appendChild(maxElement);
    }

    return container;
}

export function createReqElement(name, req) {
    const container = document.createElement('p');
    const nameElement = document.createElement('span');
    nameElement.innerText = name + ': ';
    container.appendChild(nameElement);

    const reqElement = document.createElement('span');
    reqElement.innerText = req;
    reqElement.classList.add('yellow');
    container.appendChild(reqElement);

    return container;
}