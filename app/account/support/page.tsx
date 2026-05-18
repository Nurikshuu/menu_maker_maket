'use client';

import { Phone, Mail, MessageCircle } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Служба поддержки</h1>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4">
        <SupportRow
          icon={<Phone className="size-5 text-orange-500" />}
          title="Телефон"
          value="+7 700 000 00 00"
          sub="Звонок бесплатный, пн–вс 9:00–23:00"
          href="tel:+77000000000"
        />
        <hr className="border-gray-100" />
        <SupportRow
          icon={<Mail className="size-5 text-orange-500" />}
          title="Email"
          value="support@menumaker.kz"
          sub="Отвечаем в течение 2 часов"
          href="mailto:support@menumaker.kz"
        />
        <hr className="border-gray-100" />
        <SupportRow
          icon={<MessageCircle className="size-5 text-orange-500" />}
          title="Telegram"
          value="@menumaker_support"
          sub="Среднее время ответа — 15 минут"
          href="https://t.me/menumaker_support"
        />
      </div>

      <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5 text-sm text-orange-800 space-y-2">
        <p className="font-semibold">Часто задаваемые вопросы</p>
        <ul className="space-y-2 text-orange-700 list-disc list-inside">
          <li>Как отменить заказ — напишите нам в течение 5 минут после оформления</li>
          <li>Промокод не работает — проверьте срок действия и минимальную сумму</li>
          <li>Курьер опаздывает — позвоните по номеру выше или напишите в Telegram</li>
        </ul>
      </div>
    </div>
  );
}

function SupportRow({ icon, title, value, sub, href }: { icon: React.ReactNode; title: string; value: string; sub: string; href: string }) {
  return (
    <a href={href} className="flex items-center gap-4 group" target="_blank" rel="noopener noreferrer">
      <div className="size-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-gray-400">{title}</p>
        <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{value}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>
    </a>
  );
}
