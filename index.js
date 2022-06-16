const app = Vue.createApp({
  created() {
    console.log(this.currentNum.length);
  },
  data() {
    return {
      size: 56,
      numberGroup: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "00",
        ".",
      ],
      opeartorGruop: ["+", "-", "×", "÷"],
      // 呈現畫面：不負責計算
      calculatorText: "", // 上方流程
      calculatorResult: 0, // 總數&主要顯示畫面（千分號）
      // 不呈現畫面：負責計算（因為不知道要怎麼把千分號轉成整數，所以就乾脆將顯示畫面與計算流程分開寫）
      currentNum: "", // 目前號碼
      perNum: "", // 前一個號碼
      operator: "", // 運算子
    };
  },
  methods: {
    // 選擇目前號碼
    selectNum(number) {
      switch (true) {
        case number === "0":
          this.selectZero(number);
          break;
        case number === "00":
          this.selectDoubleZero(number);
          break;
        case number === ".":
          this.selectDot(number);
          break;
        case this.perNum === "" && this.operator !== "":
          this.calculatorResult = 0;
          this.operator = "";
          this.currentNum = "";
          this.currentNum += number;
          this.calculatorResult = this.currentNum;
          break;
        default:
          this.currentNum += number;
          this.calculatorResult = this.currentNum;
          break;
      }
    },
    // 選擇0
    selectZero(number) {
      if (this.currentNum.length === 1) {
        console.log("第一個數字為0所以不能重複點0:", number);
      } else {
        this.currentNum += number;
        this.calculatorResult = this.currentNum;
      }
    },
    // 選擇00
    selectDoubleZero(number) {
      if (
        this.currentNum.substring(0) === "0" ||
        this.currentNum.length === 0
      ) {
        console.log("第一個號碼不得為「00」:", number);
      } else {
        this.currentNum += number;
        this.calculatorResult = this.currentNum;
      }
    },
    // 選擇小數點
    selectDot(number) {
      if (this.currentNum === "") {
        this.currentNum += `0${number}`;
        this.calculatorResult = this.currentNum;
      } else {
        if (this.currentNum.substring(0).indexOf(".") !== -1) {
          console.log("have dot");
        } else {
          this.currentNum += number;
          this.calculatorResult = this.currentNum;
        }
      }
    },

    // 選擇運算子
    selectOperator(operator) {
      if (this.perNum !== "" && this.operator !== "") {
        if (this.currentNum !== "") {
          this.equal();
        } else {
          this.operator = operator;
          this.calculatorText = `${this.perNum
            .toString()
            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} ${this.operator}`;
          return;
        }
      }
      this.operator = operator;
      this.perNum = this.currentNum;
      this.currentNum = "";
    },
    // 取出總數
    equal() {
      if (this.calculatorText === "") {
        console.log("不能重複點＝");
        return;
      } else {
        this.calculatorText = "";
        switch (this.operator) {
          case "+":
            this.currentNum =
              parseFloat(this.perNum) + parseFloat(this.currentNum);
            this.calculatorResult = this.currentNum;
            break;
          case "-":
            this.currentNum =
              parseFloat(this.perNum) - parseFloat(this.currentNum);
            this.calculatorResult = this.currentNum;
            break;
          case "×":
            this.currentNum =
              parseFloat(this.perNum) * parseFloat(this.currentNum);
            this.calculatorResult = this.currentNum;
            break;
          case "÷":
            if (this.perNum !== "0" && this.currentNum === "0") {
              this.currentNum = "Infinity";
            } else if (this.perNum === "0" && this.currentNum === "0") {
              this.currentNum = "NaN";
            } else {
              this.currentNum =
                parseFloat(this.perNum) / parseFloat(this.currentNum);
            }
            this.calculatorResult = this.currentNum;
            break;
        }
        this.perNum = "";
      }
    },
    // 刪除上一個
    backSpace() {
      if (this.perNum === "") {
        //留下從第0個開始算起，總長度-1
        this.currentNum = this.currentNum.substring(
          0,
          this.currentNum.length - 1
        );
        this.calculatorResult = this.currentNum;
        //
      } else {
        this.currentNum = this.currentNum.substring(
          0,
          this.currentNum.length - 1
        );
        this.calculatorResult = this.currentNum;
      }
    },
    // 刪除全部
    clearAll() {
      this.calculatorText = "";
      this.calculatorResult = 0;
      this.perNum = "";
      this.currentNum = "";
      this.operator = "";
    },
  },
  watch: {
    calculatorResult() {
      // 千分號
      this.calculatorResult = this.calculatorResult
        .toString()
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
      if (
        this.calculatorResult === "NaN" ||
        this.calculatorResult === "Infinity"
      ) {
        this.currentNum = "";
      }
    },
  },
  computed: {
    fontSize() {
      const length = this.calculatorResult.length;
      if (length > 25) {
        return (this.size = 20);
      } else if (length > 22) {
        return (this.size = 24);
      } else if (length > 17) {
        return (this.size = 27);
      } else if (length > 13) {
        return (this.size = 36);
      } else if (length > 10) {
        return (this.size = 45);
      } else {
        return (this.size = 56);
      }
    },
    //原本放在watch做監聽不能使用放在computed就可以了？？去了解watch&computed差別
    text() {
      const currency = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;
      if (this.perNum === "" && this.currentNum === "") {
        this.calculatorText = "";
      } else if (this.perNum !== "") {
        this.calculatorText = `${this.perNum
          .toString()
          .replace(currency, ",")} ${this.operator} ${this.currentNum
          .toString()
          .replace(currency, ",")}`;
      } else {
        this.calculatorText = `${this.calculatorResult
          .toString()
          .replace(currency, ",")}`;
      }
    },
    // events(){
    //   return{
    //     'click':this.selectNum(),
    //     'keyup':
    //   }
    // }
  },
});

app.mount("#app");
