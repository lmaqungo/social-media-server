class BetterDate extends Date{
    constructor(options = {dateString: null}){
        if(options.dateString) {
            super(options.dateString)
        } else{
            super(); 
        }
    }

    now() {
        const dateArr: string[] =  this.toString().split(" "); 
        const day = dateArr[2];
        const month = dateArr[1];
        const year = dateArr[3];
        const time = this.toString().split(" ")[4]?.slice(0, 5); 
        const dateObj = {
            day, 
            month, 
            year, 
            time
        }
        return JSON.stringify(dateObj)
    }

}

export default BetterDate