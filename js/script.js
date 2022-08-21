"use strict"

// timers
let counter = 4;

// ---------------------- number to check
let overtime;
let overtimePlus;
let lastMonthPay;

// ============================= min and max and value

let overalValue     = 5000000;

let overalValueMin  = 100000;
let overalValueMax  = 100000000;

let interestRate    = 10;
// interestRate = rate(interestRate);
function rate(argument) {
    return argument / 12 / 100;
};

let interestRateMin = 0.01;
let interestRateMax = 25;

let monthPay        = 50000;
let monthPayMin     = 1000;
let monthPayMax     = 5000000;

let arr = [overalValue, interestRate, monthPay];
let arrMin = [overalValueMin, interestRateMin, monthPayMin];
let arrMax = [overalValueMax, interestRateMax, monthPayMax];

// ================ флаги чистых полей
let arrFlag = [1,1,1];

// ================ максимальное количество символов в поле
let arrSymbols = [12,5,8];

// ================ максимум месяцев = 25 лет
let monthLimit = 300;

// ================ all form
let fields = document.querySelectorAll("input");
let checkout = document.querySelectorAll(".small");
let elem = document.querySelector('#total');

// ================ слова ограничений для форм
// let formInitComment = ['размер суммы от 100 000 до 100 000 000', 'ставка от 0,01% до 25%', 'размер взноса от 1000 до 5 000 000'];
// берем прямо из HTML
let formInitComment = [];
for (let i = 0; i < 3; i++) {
    formInitComment[i] = checkout[i].innerHTML;
}



// ================= functions
// minmax
function minmax(min, max, value) {
    if (value<min) {value = min};
    if (value>max) {value = max};
    return value;
}

// logarithm
function logab(number, base) {
    return Math.log(number) / Math.log(base);
};

// замена на пробел между разрядами
// /(\d)(?=(\d{3})+(?!\d))/g, '$1,'

// плата в месяц let monthPay = str * (interestRate * (1 + interestRate) ** overtime) / ((1 + interestRate) ** overtime - 1);
// let newStr = Math.ceil(monthPay)/ (interestRate * (1 + interestRate) ** overtime) / ((1 + interestRate) ** overtime - 1);
// let diffStr = newStr - str;

// ================ функции работы со статусом элемента
// ================ перевод числа в текстовую форму
function numberToText (numb, symbols) {
    // берем число и оставляем два знака после точки (точка - разделитель)
    let localNumb = Math.floor(numb * 100)/100;
    // режем полученную строку на размер в символах
    let str = String(localNumb).substr(0, symbols);
    // строку в число
    str = String(str);
    // разбираем число в строку с разрядами по три, если str >= 10000
    if (localNumb >= 10000) {
        str = String(str).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
    };
    // если число содержит дробную часть - меняем первую точку на "," 
    
    // регулярка меняет окончание числа. Если в конце только . и НОЛИ - отрезает
        str = str.replace(/\.0*$/gm, '');
    // если в строке есть дробная часть - меняет . на ,
        str = str.replace(".", ",");
return str;
};

// ================ перевод текста в числовую форму
function textToNumber (numb, symbols) {
    let str = String(numb).replace(/\./g,",");
    str = str.replace(",", ".");
    str = str.replace(/[^.\d]/g,'');
    if (str[0] == ".") {
        str = "0" + str;
    }
    if (str[0] == "0" && str[1] == "0") {
        str = str.substr(1, symbols);
    }
    str = str.substr(0, symbols);
    str = str.replace(/\.0*$/gm, '');
return +str;
};

// ============== возвращаем в форму значение при фокусе
function cleanDigit (numb, symbols) {
    let str = numb.replace(/\./g,",");
    str = str.replace(",", ".");
    str = str.replace(/[^.\d]/g,'');
    str = str.substr(0, symbols);
    if (str[0] == ".") {
        str = "0" + str;
    }
    if (str[0] == "0" && str[1] == "0") {
        str = str.substr(1, symbols);
    }
    // ============== должно оставить два знака после запятой
    // вроде работает работает
    str = str.replace(/^\d+\,\d{0,2}$/);
    str = str.replace(".", ",");
return str;
};

// ========================== инициирование форм
function initLoop() {
    for (let i = 0; i < fields.length; i++) {
        fields[i].value = numberToText(arr[i], arrSymbols[i]);
    };
};

// ========================== главный цикл форм
function mainLoop() {
    for (let i = 0; i < fields.length; i++) {

// ================ фокус =====================================
      fields[i].addEventListener("focus", function(event) {
        // здесь нужно включать таймер
        // fields[i].value = "Hello";
        arr[i] = textToNumber(fields[i].value, arrSymbols[i]);
        fields[i].value = antidot(textToNumber(arr[i], arrSymbols[i]));
      });

// ================ потеря фокуса =====================================
      fields[i].addEventListener("blur", function(event) {
        // здесь нужно включать таймер
        // Правка 15082022 ---- counter
        counter = 4;

        arr[i] = textToNumber(fields[i].value, arrSymbols[i]);
        fields[i].value = numberToText(arr[i], arrSymbols[i]);
        // правка от 09082022 --- добавляем по блуру функцию проверки значения
        if (!arrFlag[i]) {
            arbeit(i);
        }
      });

// ================ ввод в поле =====================================
      fields[i].addEventListener("input", function(event) {
        // убираем результат - расчетное время погашения
        elem.innerHTML = "";

        // выставляем флаг проверки
        arrFlag[i] = 0;
        let inputstr = fields[i].value;
        inputstr = cleanDigit (inputstr, arrSymbols[i]);
        fields[i].value = inputstr;
        arr[i] = textToNumber(fields[i].value, arrSymbols[i]);
        buttonAct();
      });
    };
};

// ============== button calculate
function period() {
    // ============= all Flags = 1
    counter = 1;
    for (let i = 0; i < arrFlag.length; i++) {
    arrFlag[i] = 1;
    console.log("Сброс флага проверки " + i + " - " + arrFlag[i]);
    }
    // ============= collect value
    for (let i = 0; i < fields.length; i++) {

        // функция проверки
    check(i)
    // ====== флаги --- чисто (1) 
    arrFlag[i] = 1;
    // ========== все три поля исправлены можно считать
  };
  reCalc();

};

function reCalc() {
    // ======== new numbers
    overalValue = arr[0];
    interestRate = arr[1];
    monthPay = arr[2];
    
    // ======== calculation
    overtime = Math.ceil(logab ((1/(1-overalValue*rate(interestRate)/monthPay)), (1+rate(interestRate))));
    console.log("периоды " + overtime);

    // ======== проверка на выход за пределы разумного!!!
    if (Number.isNaN(overtime) || overtime > monthLimit) {
        arr[2] = badNumber();
        console.log("ПЕРЕСЧЕТ!!! " + arr[2]);
        initLoop();
        reCalc();
    };

    overtimePlus = Math.ceil(overtime);
    console.log("(объем в целых) " + overtimePlus);

    lastMonthPay = cycle();

    // ===== output
    
    let endText;
    if ((overtimePlus % 12) == 0) {
        endText = "";
    } else {
        endText = `${(overtimePlus % 12)} ${textMonth(parseInt(overtimePlus % 12))}`
    }
    if (parseInt((overtimePlus/12))) {
        elem.innerHTML = `${parseInt((overtimePlus/12))} ${textYear(parseInt((overtimePlus/12)))} ${endText}`;
    }
    else elem.innerHTML = `${endText}`;


    let comm = document.getElementById('comment');
    // Правка 15082022 --------- ЖУТКАЯ КОНСТРУКЦИЯ
    comm.innerHTML = "(Месяцев: " + (overtimePlus - 1) + " ) X (" + noBreak(numberToText(monthPay)) + 
        " ежемесячно)&nbsp;= " + noBreak(numberToText((overtimePlus - 1) * monthPay, 10)) + 
        ". И&nbsp;последний платеж: " + noBreak(numberToText(Math.ceil(cent(lastMonthPay)))) + 
        ". Переплата:&nbsp;" + 
        noBreak(numberToText(Math.ceil(cent((((overtimePlus - 1) * monthPay + lastMonthPay)-overalValue))))) + ". <br> При расчете значения всех трех полей корректируются в соответствие с&nbsp;граничными&nbsp;параметрами. <br>Если расчетное время превысит 25 лет, будет скорректировано значение в&nbsp;поле&nbsp;ЕЖЕМЕСЯЧНЫЙ ВЗНОС. <br>Из-за погрешности вычислений, итоговое значение округлено.";
    buttonDis();
};

// ================= . > ,
function antidot(argument) {
    argument = String(argument).replace(".", ",");
    return argument;
}

// ================= , > .
function dot(argument) {
    argument = +String(argument).replace(",", ".");
    return argument;
}

// ================= округление вверх до двух после запятой
function cent(argument) {
    // return Math.ceil(argument*100)/100;
    return argument;
}

initLoop();
mainLoop();
reCalc();

const btn = document.querySelector("button");
btn.addEventListener("click", period);

// ====================== функция вывода "год, года, лет" от числительного
function textYear(age) {
    let txt;
    let count = age % 100;
    if (count >= 5 && count <= 20) {
        txt = 'лет';
    } else {
        count = count % 10;
        if (count == 1) {
            txt = 'год';
        } else if (count >= 2 && count <= 4) {
            txt = 'года';
        } else {
            txt = 'лет';
        }
    }
    return txt;
}

// ================ функция вывода "месяц, месяца, месяцев" от числительного
function textMonth(age) {
    let txt;
    if (age == 1) {
        txt = 'месяц';
    } else {
        if (age <= 4) {
            txt = 'месяца';
        } else  {
            txt = 'месяцев';
        }
    }
    return txt;
}

// =============== неразрывные пробелы
function noBreak(text) {
    text = text.replace(/ /g, '&nbsp;');
    return text;
}

// плата в месяц let monthPay = str * (interestRate * (1 + interestRate) ** overtime) / ((1 + interestRate) ** overtime - 1);
function badNumber() {
    // let percent = rate(interestRate);
    // let braket = (1 + percent)**monthLimit;
    // monthPay = overalValue * percent * braket / (braket - 1);
    // monthPay = overalValue * (rate(interestRate) * (1 + rate(interestRate)) ** overtime) / ((1 + rate(interestRate)) ** 300 - 1);
    monthPay = overalValue * (rate(interestRate) * (1 + rate(interestRate)) ** monthLimit) / ((1 + rate(interestRate)) ** monthLimit - 1);
    monthPay = Math.ceil(cent(monthPay));
    return monthPay;
}

// console.log("badNumber " + badNumber());



// рассчет аннуитентного платежа. 300 => 25 лет 
// x = s * (p + p / (1 + p)**300 - 1);


// неактивная кнопка
function buttonDis(){
    let btn = document.querySelector('.press');
    btn.setAttribute('disabled', true);
    btn.classList.add('nopress');
    let blackbox = document.querySelector('.commenttext');
    blackbox.classList.remove('fade');
}

// активная кнопка
function buttonAct(){
    let btn = document.querySelector('.press');
    btn.removeAttribute('disabled');
    btn.classList.remove('nopress');
    let blackbox = document.querySelector('.commenttext');
    blackbox.classList.add('fade');

    
}

// пояснения пересчета можно вставить в комментарий. делаю. Сделал

// // пора работать с таймерами
// // задержка выполнения в секундах let counter = 3;
// /*let counter = 3;
// const intervalId = setInterval(() => {
// console.log('проверка и коррекция значения через ' + counter + " с");
// counter -= 1;
// if (counter === 0) {
//     console.log('Done');
//     clearInterval(intervalId);
//     // Таймер закончил отсчет. Здесь можно вызывать функцию проверки.
//   }
// }, 1000);*/



// ======= counter - задержка в секундах, index - номер проверяемого поля
function arbeit(index) {
    // console.log('arrFlag[index] ' + arrFlag[index]);
    if (arrFlag[index]) {
        return;
        };
    let checkoutSaved = checkout[index].innerHTML;
    let intervalId = setInterval(() => {
    checkout[index].classList.add('redalert');
    checkout[index].innerHTML = "проверка и коррекция значения через " + (counter - 1) + " с"
    // console.log("проверка и коррекция значения через " + (counter - 1) + " с");
    counter -= 1;
    if (counter <= 0) {
        console.log('Done');
        clearInterval(intervalId);
        // Таймер закончил отсчет. Здесь можно вызывать функцию проверки.
        check(index);
        checkout[index].classList.remove('redalert');
        checkout[index].innerHTML = formInitComment[index];
      }
    }, 1000, index);
}

// функция проверки
function check(i) {
    // ====== value to number
    arr[i] = textToNumber(fields[i].value, arrSymbols[i]);
    // ====== number to minmax
    arr[i] = minmax(arrMin[i], arrMax[i], arr[i]);
    fields[i].value = numberToText(arr[i]);
    // ====== 
    arrFlag[i] = 1;
    console.log('ПРОВЕРКА НАЧАЛАСЬ arr[i] ' + arr[i]);
}

// таймер работает все хорошо!!!
// arbeit(1);
// console.log('checkout[1].value ' + checkout[1].innerHTML);


// -------------------- новая функция счета в цикле
function cycle() {
    let S = overalValue;
    let P = rate(interestRate);
    let n = overtimePlus;
    let x = monthPay;

    for (let i = 0; i < overtimePlus - 1; i++) {
        S = (S + S * P - x)*100/100;
    }
    return Math.ceil(S);
}
