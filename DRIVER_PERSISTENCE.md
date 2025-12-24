# Driver Data Persistence

## Overview

New drivers created through the CreateDriverPage will now be **permanently saved** to the `driversData.js` file in addition to localStorage.

## How It Works

1. **Backend API Server**: A Node.js/Express server (`server.js`) runs on port 3001
2. **API Endpoint**: `POST http://localhost:3001/api/drivers`
3. **Auto-Save**: When you create a new driver, it's automatically saved to:
   - `src/shared/data/driversData.js` (permanent file)
   - `localStorage` (browser backup)

## Running the Application

### Option 1: Run Both Frontend and Backend Together (Recommended)

```bash
npm run dev:all
```

This starts:
- Vite dev server on `http://localhost:5173`
- API server on `http://localhost:3001`

### Option 2: Run Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run server
```

## How to Create a Driver

1. Start the app with `npm run dev:all`
2. Navigate to "Driver Management" → "Driver list" tab
3. Click "+ Create driver" button
4. Fill in the driver details
5. Click "Create driver"
6. **New driver will be saved to `driversData.js` permanently!**

## Fallback Behavior

If the API server is not running:
- Drivers will still be saved to localStorage
- A warning will appear in the browser console
- You can still use the app, but data won't persist in the file

## Verifying Data Persistence

After creating a driver, check:
- `src/shared/data/driversData.js` - Driver should appear at the end of the array
- Browser DevTools → Application → Local Storage → `coco_drivers_v1`

## Troubleshooting

**Driver not appearing in driversData.js?**
- Ensure the backend server is running (`npm run server`)
- Check browser console for API errors
- Verify the server is running on port 3001

**Port 3001 already in use?**
- Edit `server.js` and change the `PORT` constant
- Update the API URL in `src/shared/data/driver.js` to match
