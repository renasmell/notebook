/**
 * @param clazz expects a JavaClass or it's name {@link String}
 * @param {String} field expects a field name {@link String}
 * @returns reflected field java.lang.reflect.Field
*/
export function reflectField(clazz, field) {
  let reflected = typeof clazz === "string"
  ? Java.type(clazz).class.getDeclaredField(field)
  : Java.type(`${clazz.class.getName()}`).class.getDeclaredField(field);

  reflected.setAccessible(true);
  
  return reflected;
}
/**
 * @param clazz expects a JavaClass or it's name {@link String}
 * @param {String} func expects a method name {@link String}
 * @param types expects a JavaClass for a type or a array of JavaClass [JavaClass]
 * @returns reflected method java.lang.reflect.Method 
*/
export function reflectMethod(clazz, func, types=null) {
  let reflected = typeof clazz === "string"
  ? Java.type(clazz).class.getDeclaredMethod(func, types)
  : Java.type(`${clazz.class.getName()}`).class.getDeclaredMethod(func, types);

  reflected.setAccessible(true);
  
  return reflected;
}

export function getPageTagList(lines=[]) {
  const MCNBTTagList = net.minecraft.nbt.NBTTagList;
  const NBTTagString = net.minecraft.nbt.NBTTagString;
  let pages = new NBTTagList(new MCNBTTagList());

  lines.forEach(l => pages.appendTag(new NBTTagString(new java.lang.String(l))));

  return pages;
}

const Color = java.awt.Color;

/**
 * 
 * @param {int} r 0-255 
 * @param {int} g 0-255 
 * @param {int} b 0-255 
 * @param {int} a 0-255 
 * @returns java.awt.Color;
 */
export const getColor = (r,g,b,a) => new Color(r / 255, g / 255, b / 255, a / 255);

export function getBookInfo(stack) {
  let nbt = stack.getNBT();
  let object = nbt.toObject()["tag"];

  let info = {};

  if (nbt.getTag('tag').getTag('pages')) info["pages"] = object["pages"];
  if (nbt.getTag('tag').getTag('author')) info["author"] = object["author"];
  if (nbt.getTag('tag').getTag('title')) info["title"] = object["title"];
  if (nbt.getTag('tag').getTag('resolved')) info["resolved"] = object["resolved"];

  return info;
}

/**
 * from the ChatTriggers discord. \@camnw https://discord.com/channels/119493402902528000/1123661597789933618/1123672577932541972
 * @param {string} rawNbtStr 
 * @returns 
 */
export function getItemFromNBT(nbtStr) {
  const MCItemStack = Java.type("net.minecraft.item.ItemStack");
  const nbte = net.minecraft.nbt.JsonToNBT.func_180713_a(nbtStr);
  return new Item(MCItemStack.func_77949_a(nbte));
}