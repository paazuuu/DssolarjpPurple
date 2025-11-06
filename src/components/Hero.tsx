import React, { useMemo } from 'react';
import { Sun, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCompanyInfo } from '../hooks/useCompanyInfo';

export const Hero: React.FC = () => {
  const { language, t } = useLanguage();
  const { data: company } = useCompanyInfo();

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ヒーローアイコンの表示制御とURL取得
  // hero_icon_visibleがtrueの場合のみ表示（明示的にtrueでなければ非表示）
  const shouldShowIcon = company?.hero_icon_visible === true;
  // hero_icon_urlがなければbrowser_favicon_urlを使用、それもなければデフォルトの/sun-icon.svgを使用
  const iconUrl = company?.hero_icon_url || company?.browser_favicon_url || '/sun-icon.svg';

  // 背景色のグラデーションを動的に生成
  const gradientColors = useMemo(() => {
    const baseColor = company?.hero_bg_color || '#8b5cf6'; // デフォルトは紫色
    
    // HEXカラーをRGBに変換
    const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    // RGBからHSLに変換
    const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
      r /= 255;
      g /= 255;
      b /= 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }
      return { h: h * 360, s: s * 100, l: l * 100 };
    };

    // HSLからHEXに変換
    const hslToHex = (h: number, s: number, l: number): string => {
      l /= 100;
      const a = s * Math.min(l, 1 - l) / 100;
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    };

    const rgb = hexToRgb(baseColor);
    if (!rgb) return {
      bg: 'from-indigo-50 via-purple-50 to-blue-50',
      blob1: '#c7d2fe',
      blob2: '#ddd6fe',
      blob3: '#bfdbfe'
    };

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    // グラデーション用の3色を生成
    // 1. メインカラーより明るく薄い色（背景グラデーションの開始色）
    const color1Hsl = { h: hsl.h, s: Math.max(20, hsl.s - 30), l: Math.min(95, hsl.l + 40) };
    // 2. メインカラーより少し明るい色（背景グラデーションの中間色）
    const color2Hsl = { h: (hsl.h + 10) % 360, s: Math.max(25, hsl.s - 20), l: Math.min(92, hsl.l + 35) };
    // 3. メインカラーの補色系（背景グラデーションの終了色）
    const color3Hsl = { h: (hsl.h + 180) % 360, s: Math.max(20, hsl.s - 30), l: Math.min(93, hsl.l + 38) };

    // ブロブ用の色を生成（より濃い色）
    const blob1Hsl = { h: hsl.h, s: Math.max(40, hsl.s - 10), l: Math.min(85, hsl.l + 20) };
    const blob2Hsl = { h: (hsl.h + 15) % 360, s: Math.max(45, hsl.s - 5), l: Math.min(83, hsl.l + 18) };
    const blob3Hsl = { h: (hsl.h - 15 + 360) % 360, s: Math.max(40, hsl.s - 10), l: Math.min(86, hsl.l + 22) };

    return {
      bg: `linear-gradient(to bottom right, ${hslToHex(color1Hsl.h, color1Hsl.s, color1Hsl.l)}, ${hslToHex(color2Hsl.h, color2Hsl.s, color2Hsl.l)}, ${hslToHex(color3Hsl.h, color3Hsl.s, color3Hsl.l)})`,
      blob1: hslToHex(blob1Hsl.h, blob1Hsl.s, blob1Hsl.l),
      blob2: hslToHex(blob2Hsl.h, blob2Hsl.s, blob2Hsl.l),
      blob3: hslToHex(blob3Hsl.h, blob3Hsl.s, blob3Hsl.l)
    };
  }, [company?.hero_bg_color]);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center pt-16"
      style={{ background: gradientColors.bg }}
    >
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-20 right-10 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
          style={{ backgroundColor: gradientColors.blob1 }}
        ></div>
        <div 
          className="absolute top-40 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"
          style={{ backgroundColor: gradientColors.blob2 }}
        ></div>
        <div 
          className="absolute -bottom-8 left-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"
          style={{ backgroundColor: gradientColors.blob3 }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* アイコン - 管理画面から制御可能 */}
          {shouldShowIcon && (
            <div className="inline-flex items-center justify-center mb-6">
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt="Company Icon"
                  className="w-20 h-20 object-contain"
                  onError={(e) => {
                    // 画像読み込みエラー時はSunアイコンにフォールバック（背景付き）
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallbackIcon = document.createElement('div');
                      fallbackIcon.className = 'inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg';
                      fallbackIcon.innerHTML = '<svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>';
                      parent.appendChild(fallbackIcon);
                    }
                  }}
                />
              ) : (
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg">
                  <Sun className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
          )}

          {/* メインキャッチコピー */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {language === 'zh' ? company?.company_name_zh : company?.company_name}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-4 font-medium">
            {language === 'zh' ? company?.business_content_zh : company?.business_content_ja}
          </p>

          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            {t(
              '「設置して終わり」ではなく、「発電を続ける力」を守ることが使命です。',
              '我们的使命不是"安装完就结束"，而是守护"持续发电的力量"。'
            )}
          </p>

          {/* CTAボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleScroll('contact')}
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all transform hover:scale-105 shadow-lg"
            >
              {t('お問い合わせ', '联系我们')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('service')}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary border-2 border-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all transform hover:scale-105 shadow-lg"
            >
              {t('サービス詳細', '服务详情')}
            </button>
          </div>
        </div>
      </div>

      {/* スクロールインジケーター */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};
