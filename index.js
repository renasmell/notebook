/// <reference types="../CTAutocomplete" />

import PogObject from "../PogData";

let data = new PogObject("notebook", {
  booknbt: [],
  current_id: 0
}, "books.json")

import { getItemFromNBT, getPageTagList, reflectField, reflectMethod } from "./util";

const GuiScreenBook = net.minecraft.client.gui.GuiScreenBook;

const book = reflectField("com.chattriggers.ctjs.minecraft.objects.Book", "book");
const bookData = reflectField("com.chattriggers.ctjs.minecraft.objects.Book", "bookData");
const getFreshBook = () => {

  let tagCompound = new net.minecraft.nbt.NBTTagCompound();
  let pages = new net.minecraft.nbt.NBTTagList();
  // appendTag
  pages.func_74742_a(new net.minecraft.nbt.NBTTagString())
  // set string
  tagCompound.func_74778_a("author", DataHandler.getId())
  // setTag
  tagCompound.func_74782_a("pages", pages);
  let i = new Item('writable_book').itemStack;
  i.func_77982_d(tagCompound);

  return i;
} 
// bookname 
let editing = false;

const buttonList = reflectField(net.minecraft.client.gui.GuiScreen, "field_146292_n");
const bookObj = reflectField(GuiScreenBook, "field_146474_h");
const buttonDone = reflectField(GuiScreenBook, "field_146472_C");
// we need helper because breaks java lists
const helper = Java.type("dev.renasmell.JavaHelper");
import { GuiButton } from "./GuiButton";

let done = new GuiButton(0,0,0,0,"Done");
done.setEnabled(true);

register('postGuiRender', (mx,my, gui) => {
  if (!editing || !(gui instanceof GuiScreenBook)) return;

  while(buttonList.get(gui).length > 2) helper.removeFirstElement(buttonList, gui);
  Tessellator.pushMatrix();
  let oldDoneButton = buttonDone.get(gui);
  done.setWidth(192);
  done.setHeight(oldDoneButton.field_146121_g);
  done.setX((gui.field_146294_l / 2) - (192 / 2));
  done.setY(oldDoneButton.field_146129_i);

  done.render(0,0);
  Tessellator.popMatrix();
});
const bookPages = reflectField(GuiScreenBook, "field_146483_y");
register('guiMouseClick', (mx,my, _, mcgui, __) => {
  if (!editing || !(mcgui instanceof GuiScreenBook)) return;
  
  if (!done.isHovered(mx,my)) return;
    // write data to notebook
    let item = bookObj.get(mcgui);

    // it doesnt write pages so we have to manually.
    // getTagCompound
    World.playSound("random.click", 5, 5);
    item.func_77978_p().func_74782_a("pages", bookPages.get(mcgui));
    DataHandler.writeBook(new Item(item));
    updateBooks();
    gui.open();
    editing = false;

});
import {
  CenterConstraint,
  FillConstraint,
  SiblingConstraint,
  SubtractiveConstraint,
  UIBlock,
  UIText,
  UIRoundedRectangle,
  ScrollComponent,
  Window,
  UIImage,
  Window,
  UITextInput,
  UIContainer
} from "../Elementa";

const p = int => int.pixels();
const pe = int => int.percent();
import { getColor } from "./util";

const DataHandler = {
  writeBook(stack, name=null) {
    if (!data.booknbt?.some(b => b.id === getBookInfo(stack).author)) return this.addBook(stack, name);
    let i = data.booknbt.findIndex(b => b.id === getBookInfo(stack).author);
    data.booknbt.splice(i, 1, { name: name || data.booknbt[i].name, nbt: stack.getRawNBT(), id: getBookInfo(stack).author });

    data.save();
  },

  deleteBook(stack) {
    if (!data.booknbt?.some(b => b.id === getBookInfo(stack).author)) return;

    data.booknbt.splice(data.booknbt.findIndex(b => b.id === getBookInfo(stack).author), 1);

    data.save();
  },

  addBook(stack) {
    let d = new Date().toString();
    d = d.substring(0, d.lastIndexOf(':') + 2);
    let id = getBookInfo(stack).author;

    data.booknbt.push({ name: `#${id} ${d}`, nbt: stack.getRawNBT(), id: id });

    data.save();
  },

  getId() {
    data.current_id++;
    data.save();
    return data.current_id;    
  }
}

import { getBookInfo } from "./util";

// https://discord.com/channels/119493402902528000/1109135083228643460/1125398510666256384 @Koenbezeg
function UIItem(item) {
    return new JavaAdapter(UIBlock, {
      draw: function() {
        Tessellator.pushMatrix();
        item.draw(this.getLeft(), this.getTop(), this.getHeight() / 16);
        Tessellator.popMatrix();
      }
    });
}

function UIBook(stack, parent, name) {
  const background = new UIBlock(getColor(80, 80, 80, 255))
    .setX(p(4))
    .setY(new SiblingConstraint(4))
    .setWidth(new SubtractiveConstraint(pe(100), p(8)))
    .setHeight(p(50))
    
    if (parent) background.setChildOf(parent);

    let book = new UIItem(new Item("written_book"))
    .setX(p(5))
    .setY(new CenterConstraint())
    .setWidth(p(40))
    .setHeight(p(40))
    .setChildOf(background);
    
    let book_name_input = new UITextInput(name, true)
    .setX(p(95))
    .setY(new CenterConstraint())
    .setWidth(p(300))
    .setHeight(p(10))
    .onMouseClick((comp) => comp.grabWindowFocus())
    .onKeyType((input) => DataHandler.writeBook(stack, input.getText()))
    .setChildOf(background);

    let book_name_text = new UIText("name:")
    .setX(p(60))
    .setY(new CenterConstraint()) 
    .setChildOf(background);

    
    
    let book_destroy_button = new UIBlock(getColor(109, 0, 0, 255))
    .setX((4).pixels(true))
    .setY(new CenterConstraint())
    .setWidth(p(30))
    .setHeight(p(30))
    .onMouseClick((comp) => {
      // funny
      comp.getParent().getParent().removeChild(comp.getParent());
      DataHandler.deleteBook(stack);
    })
    .setChildOf(background);
    
      let book_destroy_text = new UIText("x")
      .setX(new CenterConstraint())
      .setY(new CenterConstraint())
      .setTextScale(p(2))
      .setColor(getColor(255, 0, 0, 255))
      .setChildOf(book_destroy_button);

    let book_edit_button = new UIBlock(getColor(100,100,100,255))
    .setX((38).pixels(true))
    .setY(new CenterConstraint())
    .setWidth(p(30))
    .setHeight(p(30))
    .onMouseClick(() => {
      // open a new gui 
      editing = true; 
        
      GuiHandler.openGui(new GuiScreenBook(Player.getPlayer(), stack.itemStack, true));
    })
    .setChildOf(background);

      let book_edit_image = new UIImage.ofFile(new java.io.File(Config.modulesFolder, "notebook/assets/edit.png"))
      .setX(new CenterConstraint())
      .setY(new CenterConstraint())
      .setWidth(p(28))
      .setHeight(p(28))
      .setChildOf(book_edit_button);
    
    let book_view_button = new UIBlock(getColor(100,100,100,255))
    .setX((72).pixels(true))
    .setY(new CenterConstraint())
    .setWidth(p(30))
    .setHeight(p(30))
    .onMouseClick(() => {
      let b = new Book("n/a");
      b.updateBookScreen(getPageTagList(getBookInfo(stack).pages));

      b.display();
    })
    .setChildOf(background);

      let book_view_image = new UIImage.ofFile(new java.io.File(Config.modulesFolder, "notebook/assets/search.png"))
      .setX(new CenterConstraint())
      .setY(new CenterConstraint())
      .setWidth(p(28))
      .setHeight(p(28))
      .setChildOf(book_view_button);



    return background;
}

// gui

let window = new Window();
    const background = new UIRoundedRectangle(10)
    .setX(new CenterConstraint())
    .setY(new CenterConstraint())
    .setWidth(pe(50))
    .setHeight(pe(70))
    .setColor(getColor(50, 50, 50, 255))
    .setChildOf(window)

      let background_top = new UIRoundedRectangle(10)
      .setWidth(pe(100))
      .setHeight(pe(10))
      .setColor(getColor(27, 32, 36, 255))
      .setChildOf(background);

        let background_flat = new UIBlock(getColor(27, 32, 36, 255))
        .setY(p(10))
        .setWidth(pe(100))
        .setHeight(new SubtractiveConstraint(pe(100), p(10)))
        .setChildOf(background_top);
      
        let background_top_text = new UIText("Notebook")
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setColor(getColor(0, 200, 0, 255))
        .setTextScale(p(3))
        .setChildOf(background_top);

        let exit_button = new UIBlock(getColor(100, 0, 0, 255))
        .setX((9).pixels(true))
        .setY(new CenterConstraint())
        .setWidth(p(20))
        .setHeight(p(20))
        .onMouseClick(() => Client.currentGui.close())
        .setChildOf(background_top);

          let exit_button_text = new UIText("x")
          .setX(new CenterConstraint())
          .setY(new CenterConstraint())
          .setTextScale(p(2))
          .setChildOf(exit_button);

      let entry_background = new UIRoundedRectangle(2)
        .setX((40).pixels(true))
        .setY(new CenterConstraint())
        .setWidth(p(20))
        .setHeight(p(20))
        .onMouseClick(() => {
          // open a new gui 
          editing = true; 
 
          GuiHandler.openGui(new GuiScreenBook(Player.getPlayer(), getFreshBook(), true));
        })
        .setColor(getColor(220, 220, 220, 255))
        .setChildOf(background_top);

        let entry_text = new UIText("+")
          .setX(new CenterConstraint())
          .setY(new CenterConstraint())
          .setTextScale(p(2))
          .setColor(getColor(0, 220, 0, 255))
          .setChildOf(entry_background);
      
      // actual book shit
      let container_for_books = new UIContainer()
        .setY(new SiblingConstraint())
        .setWidth(pe(100))
        .setHeight(new SubtractiveConstraint(new FillConstraint(), p(5)))
        .setChildOf(background);

        let book_entries_text = new UIText("Entries:")
        .setChildOf(container_for_books);

        let books = new ScrollComponent()
          .setY(new SiblingConstraint())
          .setWidth(pe(100))
          .setHeight(pe(95))
          .setChildOf(container_for_books);
        
        books.setScrollBarComponent(new UIBlock(getColor(255,255,255,255))
        .setX((2).pixels(true))
        .setWidth(p(4))
        .setHeight(new FillConstraint()).setChildOf(container_for_books), false, false)
        
  
      function updateBooks() {
        books.clearChildren();
        data.booknbt?.forEach(b => new UIBook(getItemFromNBT(b.nbt), books, b.name));
      }


const gui = new Gui();
gui.registerDraw(() => window.draw());
gui.registerClicked((mx, my, but) => window.mouseClick(mx, my, but));
gui.registerMouseReleased(() => window.mouseRelease());
gui.registerKeyTyped((typed, key) => window.keyType(typed, key));
gui.registerScrolled((_, __, scroll) => window.mouseScroll(scroll));

register('command', () => {
  gui.open();
  updateBooks();
}).setName('notebook');
