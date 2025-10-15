export function Footer() {
  return (
    <footer className="bg-[#1e293b] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
          <div>
            <h3 className="text-xl font-bold mb-4">Udaxgui.com</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              "Өдрүүд иртэл, нөөдөөр гэрэл үүлийн болдог хөмийлөл өүү нь хайр хөмөөс." — 1 Коринт 13:13
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">ХОЛБООСУУД</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Нүүр
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Нийтлэлүүд
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Сайн мэдээ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Бидний тухай
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          © 2025 Udaxgui.com. Бүх эрх хуулиар хамгаалагдсан.
        </div>
      </div>
    </footer>
  )
}
