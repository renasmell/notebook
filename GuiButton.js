import { reflectField } from "./util";

const MCGuiButton = net.minecraft.client.gui.GuiButton;
const isEnabledField = reflectField(MCGuiButton, "field_146124_l");
const textField = reflectField(MCGuiButton, "field_146126_j");

/* 
   !IMPORTANT a good portion of the code below is from
   HousingEditor by ImaDoofus
   https://github.com/ImaDoofus/HousingEditor/blob/master/gui/components/Button.js
   so mad props @ImaDoofus
*/
export class GuiButton {

    constructor(x, y, width, height, text) {
        this.mcObject = new MCGuiButton(0, x, y, width, height, text);
    }

    getX() {
        return this.mcObject.field_146128_h;
    }

    getY() {
        return this.mcObject.field_146129_i;
    }

    getWidth() {
        return this.mcObject.field_146120_f;
    }

    getHeight() {
        return this.mcObject.field_146121_g;
    }

    setX(x) {
        this.mcObject.field_146128_h = x;
    }

    setY(y) {
        this.mcObject.field_146129_i = y;
    }

    setWidth(width) {
        this.mcObject.field_146120_f = width;
    }

    setHeight(height) {
        this.mcObject.field_146121_g = height;
    }

    setEnabled(enabled) {
        isEnabledField.set(this.mcObject, enabled);
    }

    getEnabled() {
        return isEnabledField.get(this.mcObject);
    }

    setText(text) {
        textField.set(this.mcObject, text);
    }

    getText() {
        return textField.get(this.mcObject);
    }

    render(x, y) {
        this.mcObject.func_146112_a(Client.getMinecraft(), x, y);
    }

    isHovered(x, y) {
        return x >= this.getX() && x <= this.getX()+this.getWidth() && y >= this.getY() && y <= this.getY()+this.getHeight();
    }
}