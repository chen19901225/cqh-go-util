
class LineExtractor {
    index: number;
    element_list: Array<string> = [];
    run: string;
    constructor(public line: string) {
        this.index = 0;
        this.run = "";
    }
    loop() {
        while (1) {
            if (this.index === this.line.length) {
                if (this.run && this.run.length > 0) {
                    this.element_list.push(this.run);

                }
                return;
            }
            this.step()

        }
    }
    step() {
        let ch = this.line[this.index];
        if (ch.match(/[_a-zA-Z0-9.]/)) {
            this.run += ch;
            this.index += 1;
            return;
        }
        if (ch === '"' || ch === "'") {// 匹配字符串
            this.run += ch;
            this.index += 1;
            this.walk_until(ch)
            return;
        }
        if (ch === "[") {
            this.run += ch;
            this.index += 1;
            this.walk_until("]")
            return;
        }
        if (ch == "(") {
            this.run += ch;
            this.index += 1;
            this.walk_until(")")
            return;
        }

        if (this.run && this.run.length > 0) {
            this.element_list.push(this.run)
            this.run = ""
        }
        this.index += 1;


    }

    walk_until(search: string) {

        while (1) {
            let ch = this.line[this.index];
            if (ch === undefined) {
                return;
            }
            this.run += ch;
            this.index += 1;

            if (ch === search) {
                break;
            }

        }



    }
}

export function get_variable_list(line: string): Array<string> {
    let obj = new LineExtractor(line);
    obj.loop()
    return obj.element_list;
}