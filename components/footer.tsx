export function Footer() {
  return (
    <footer className="bg-[#1e293b] text-white py-12">
      <div className="w-full">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 w-full items-start">
            <div>
            <h3 className="text-xl font-bold mb-4">Udaxgui.com</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-2">
              "Эдүгээ итгэл, найдвар, хайр гурав үлддэг боловч хамгийн агуу нь хайр мөн."
            </p>
            <div className="text-gray-400 text-sm mb-4">— 1 Коринт 13:13</div>
          </div>

          <div className="flex flex-col md:items-end">
            <h4 className="font-semibold mb-4">ХОЛБООСУУД</h4>
            <nav aria-label="footer links">
              <ul className="flex flex-wrap gap-6 text-sm">
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
            </nav>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2025 Udaxgui.com. Бүх эрх хуулиар хамгаалагдсан.
          </div>
        </div>
      </div>
    </footer>
  )
}
