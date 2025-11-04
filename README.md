# Study Map - Explore Masters in Finance Worldwide

An interactive web application to discover and compare Masters in Finance programs from top universities around the globe.

## Features

🌍 **Interactive World Map** - Explore programs geographically with Mapbox integration
🔍 **Smart Search & Filters** - Find programs by name, location, duration, language, and more
📊 **Detailed Program Information** - Complete details including rankings, tuition, and admission requirements
📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
🌙 **Dark Mode Support** - Toggle between light and dark themes
📋 **List & Map Views** - Switch between map visualization and detailed list view

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS
- **Maps**: Mapbox GL JS
- **UI Components**: Headless UI
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

1. **Install dependencies**:
```bash
npm install
```

2. **Set up Google Sheets API (Optional)**:
The application works with fallback data, but for live data from Google Sheets:
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select existing one
- Enable Google Sheets API
- Create credentials (API Key)
- Copy `.env.example` to `.env.local`
- Add your API key to `.env.local`

3. **Set up Mapbox token**:
The Mapbox token is already configured in the code. For production, you should:
- Create your own Mapbox account at https://mapbox.com
- Get your access token
- Replace the token in `components/SheetMapComponent.tsx`

4. **Run the development server**:
```bash
npm run dev
```

5. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Homepage
│   └── map/              # Map page
├── components/            # React components
│   ├── FilterPanel.tsx   # Sidebar filters
│   ├── Header.tsx        # Navigation header
│   ├── MapComponent.tsx  # Mapbox integration
│   ├── ProgramList.tsx   # List view
│   └── ProgramModal.tsx  # Program details modal
├── data/                 # Static data
│   └── programs.ts       # Masters programs data
├── types/                # TypeScript definitions
│   └── program.ts        # Program interface
└── public/               # Static assets
```

## Data Management

The application integrates with Google Sheets to fetch live data:

### Google Sheets Structure
- **BASE Sheet**: Contains school information (name, country, coordinates, etc.)
- **BASE V2 Sheet**: Contains program information (linked to schools via school name)

### Data Flow
1. Application fetches data from both sheets using Google Sheets API
2. Data is transformed and combined (schools with their programs)
3. Fallback data is used if API is unavailable
4. Manual refresh available via header button

### Adding New Data
1. Add schools to the BASE sheet with coordinates
2. Add programs to the BASE V2 sheet with matching school names
3. Use the refresh button in the app to reload data

## Customization

### Adding New Program Fields
1. Update the `Program` interface in `types/program.ts`
2. Modify the data structure in `data/programs.ts`
3. Update the UI components to display new fields

### Styling
- Modify `tailwind.config.js` for theme customization
- Update color schemes in the config
- Customize component styles in individual files

### Map Styling
- Change map style in `MapComponent.tsx`
- Available Mapbox styles: light-v11, dark-v10, streets-v11, satellite-v9

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Future Enhancements

- [ ] User authentication and favorites
- [ ] Program comparison tool
- [ ] Advanced filtering (GMAT scores, rankings)
- [ ] Integration with university APIs
- [ ] Student reviews and ratings
- [ ] Application deadline tracking
- [ ] Multi-language support
- [ ] Export functionality (PDF, CSV)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.