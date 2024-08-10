import WhatsappIcon from "@/icons/WhatsappIcon";

export default function WhatsappButton() {
  return (
    <div className="fixed bottom-10 right-10 z-50 p-3 flex drop-shadow-xl">
      <a
        href="https://wa.me/5491154041650?text=Hola%20Nippon%20Game.%20Quiero%20realizar%20una%20consulta!"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-700 rounded-full p-3 flex items-center justify-center transition-transform transition-colors duration-500 ease-in-out transform "
      >
        <WhatsappIcon width={30} height={30} className="text-white transition-transform duration-500 ease-in-out transform hover:scale-105" />
      </a>
    </div>
  );
}
