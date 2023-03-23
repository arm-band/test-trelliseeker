/**
 *
 * @param {string} str
 * @return {string}
 */
const doubleCRLFEraser = (str) => {
    if(str.length === 0) {
        return str;
    }

    return str.replace(/\r?\n/ig, `\n`).replace(/(\n){2}/ig, `\n`);
};

const str2Array = (str) => {
    if(str.length === 0) {
        return str;
    }

    const taskarray = [];
    let taskString = '';
    const taskFormat = /(TODO|DOING)(.*)\n([\d]{4}-[\d]{2}-[\d]{2})/;
    const headingErased = str.replace(/\n*Type to search, enter to create\n+Marker:\n+[\w\d]+\n+Priority:\n+[\w\d]+\n+/ig, '').replace(/Today\n+/ig, '').replace(/Scheduled\n+/ig, `\n`);
    const matches = headingErased.match(
        new RegExp(
            taskFormat,
            'ig'
        )
    );
    if(typeof matches !== 'object' || matches === null ||  matches.length === 0) {
        return 'error';
    }
    for (const match of matches) {
        const hit = match.match(
            new RegExp(
                taskFormat,
                'i'
            )
        );
        taskarray.push(
            {
                'progress': hit[1],
                'schedule': hit[3],
                'scheduleNumber': parseInt(hit[3].replace(/\-/ig, '')),
                'task': hit[2],
            }
        );
    }
    // DESC
    const taskarrayDesc = taskarray.sort(function(a, b) {
        return b['scheduleNumber'] - a['scheduleNumber'];
    });
    for (const task of taskarrayDesc) {
        taskString += `${task['progress']} *[${task['schedule']}]* **${task['task']}**\n`;
    }
    return taskString;
};

window.addEventListener('load', () => {
    const $original = document.querySelector('#original');
    const $convertedResult = document.querySelector('#converted-result');
    $original.addEventListener('blur', (e) => {
        $convertedResult.value = str2Array(doubleCRLFEraser(e.target.value));
    });
});
