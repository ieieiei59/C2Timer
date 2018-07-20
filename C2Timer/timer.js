document.onkeydown = keydown;

var CubeTimer = class{
    constructor(){
        // コンストラクタ

        // DOM準備
        this._timeDOM = document.getElementById("time");

        // タイマーの状態保持用
        // statusNum と statusList は内部用
        this.status = "stop";
        this._statusNum = 0;
        this._statusList = ["stop", "inspection", "start"];
        this._isPlus2 = false;
        this._isDnf = false;

        // インスペクション
        this._inspectionTime = 15;
        this._remainingTime = 15;
        this._inspectionStartDate = null;

        // タイマー
        this._timerStartDate = null;
        this._time = 0.000;
    }

    printDetail(){
        console.log("Status: " + this.status);
        console.log("+2: " + this._isPlus2);
        console.log("DNF: " + this._isDnf);
        console.log("Inspection time: " + this._remainingTime);
        console.log("Solve time: " + this._time);
    }

    switchStatus(){
        // タイマーの状態を変更（ロータリースイッチ的な変更をする）
        this._statusNum += 1;
        this._statusNum %= 3;

        this._status = this._statusList[this._statusNum];
    }

    getStatus(){
        // タイマーの状態を取得
        return this._status;
    }

    setStatus(status){
        try{
            this._statusNum = _statusList.indexOf(status);
            this._status = this._statusList[this._statusNum];            
        }
        catch(e){
            return false
        }
        return true
    }

    startInspection(){
        // インスペクションをスタート
        this._resetInspection();
        this._inspectionStartDate = Date.now();
        this._countDownInspection();
        var inspectionRoop = setInterval(() => {
            this._countDownInspection();
            this._isPlus2 = false;
            if(this._remainingTime < -2){
                clearInterval(inspectionRoop);
                setStatus("stop");
                this._isDnf = true;
            }
            else if(this._status != "inspection"){
                clearInterval(inspectionRoop);
                if(this._remainingTime < 0){
                    this._isPlus2 = true;
                }
            }
        }, 10);
    }

    _resetInspection(){
        // インスペクション用の変数を初期化
        this._remainingTime = this._inspectionTime;
    }
    
    _countDownInspection(){
        // インスペクションタイムを表示
        this._remainingTime = this._inspectionTime -  Math.floor((Date.now()-this._inspectionStartDate) / 1000);
        this._timeDOM.innerText = this._remainingTime;
    }

    getTime(){        
        return this._time;
    }

    startTimer(){
        this._resetTimer();
        this._timerStartDate = Date.now();
        this._updateTimer();
        var timerRoop = setInterval(() => {
            this._updateTimer();
            if(this._status != "start"){
                clearInterval(timerRoop);
            }
        }, 1);
        
    }

    _resetTimer(){
        this._time = 0.000;
    }

    _updateTimer(){
        this._time = (Date.now()-this._timerStartDate) / 1000;
        this._timeDOM.innerText = this._getTimeText();
    }

    _getTimeText(){
        var minText = "0";
        var secText = "00";
        var decText = "000";
        var minFlag = false;
        if(this._time > 60){
            minText = Math.floor(this._time/60).toString();
            minFlag = true;
        }
        if(this._time > 1){
            secText = Math.floor(this._time%60).toString();
            secText = ("00" + secText).slice(-2);
        }
        if(this._time > 0){
            decText = Math.floor((this._time%1) * 1000).toString();
            decText = ("000" + decText).slice(-3);
        }

        if(minFlag){
            var returnText = minText + ":" + secText + "." + decText;
        }
        else{
            var returnText = secText + "." + decText;
        }
        return returnText;
    }
    
}

var cubeTimer = new CubeTimer();


function keydown(e){
    if(e.keyCode == 32){
        // スペースキーが押された
        cubeTimer.switchStatus();
        switch(cubeTimer.getStatus()){
        case "stop":
            // タイマーの状態がストップになったときの処理
            break;
        case "inspection":
            // タイマーの状態がインスペクションになったときの処理
            cubeTimer.startInspection();
            break;
        case "start":
            // タイマーの処理がスタートになったときの処理
            cubeTimer.startTimer();
            break;            
        }
    }
}

