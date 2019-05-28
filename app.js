const btn = document.createElement('button');
btn.textContent="Press me";
document.body.appendChild(btn);
btn.addEventListener('click', function () {
    fetchAll('https://swapi.co/api/planets',[]).then(function(planets){
        outputPlanets(planets);
    }).catch(function(error){
        console.log(error);
    })
});

function fetchAll(url, planets){
    return new Promise(function(resolve, reject) {
        return fetch(url).then(function (rep) {
            console.log(rep);
            if(rep.status !== 200){throw 'Uh-ho!'}
            return rep.json()
        }).then(function (data) {
            planets = planets.concat(data.results);
            console.log(planets);
            if (data.next) {
                console.log('next url' + data.next);
                fetchAll(data.next, planets).then(resolve);
            } else {
                let arr = planets.map(function (item) {
                    return {name: item.name, films: item.films};
                });
                resolve(arr)
            }
        }).catch(function (error) {
            console.log(error);
        });
    });
}
const output = document.createElement('div');
document.body.appendChild(output);

function outputPlanets(data){
    output.innerHTML = `<h1 class="blue">${data.length} results found</h1>`;
    data.forEach(function(item){
        console.log(item);
        const div = document.createElement('div');
        div.textContent = item.name;
        div.style.color="green";
        if(item.films.length > 0) {
            const ul = document.createElement('ul');
            for (let x = 0; x < item.films.length; x++) {
                let li = document.createElement('li');
                li.textContent = item.films[x];
                if(x % 2 === 0) {
                    li.style.color = "blue";
                }else{li.style.color = "red";}
                ul.appendChild(li);
            }
            div.appendChild(ul);
        }else{
            let span = document.createElement('span');
            span.textContent = ` ${item.films.length} films found`;
            div.appendChild(span);
        }
        output.appendChild(div);
    });
}

function fetchData(url) {
    fetch(url).then(function(rep) {
        return rep.json()
    }).then(function(data) {
        output.textContent = `${data.count} results found.`;
        if(data.next){
            const btn2 = document.createElement('button');
            btn2.textContent = "Next";
            output.appendChild(btn2);
            btn2.addEventListener('click',function(){
                fetchData(data.next)
            })
        }
        const planets = data.results.map(function(item){
           console.log(item);
           return {name: item.name, films: item.films};
        });
        outputPlanets(planets);
    })
}