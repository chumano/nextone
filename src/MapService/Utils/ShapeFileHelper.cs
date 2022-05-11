using GeoAPI.CoordinateSystems;
using GeoAPI.CoordinateSystems.Transformations;
using GeoAPI.Geometries;
using ProjNet.Converters.WellKnownText;
using ProjNet.CoordinateSystems;
using ProjNet.CoordinateSystems.Transformations;
using SharpMap.Data;
using SharpMap.Data.Providers;
using SharpMap.Layers;
using SharpMap.Rendering.Thematics;
using SharpMap.Styles;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;

namespace MapService.Utils
{
    public static class ShapefileHelper
    {
        private static readonly ICoordinateTransformation VietNamTransformation;

        static readonly int SourceSRID = 3405; //VN2000
        static readonly int TargetSRID = 4326; //chuan latlng
                                      //l.SRID = 4326;
                                      //l.TargetSRID = 900913; 

        //3405; //VN2000
        //google 900913 or [3857]-cai sau da test
        // SRID   4326; //chuan latlng

        static ShapefileHelper()
        {
            bool isNorthHemisphere = true; //vietnam is north
            ICoordinateTransformation transformation;//= ProjHelper.LatLonToGoogle();
            CoordinateTransformationFactory factory = new CoordinateTransformationFactory();
            IGeographicCoordinateSystem wgs84 = GeographicCoordinateSystem.WGS84;
            IProjectedCoordinateSystem vn2000 = ProjectedCoordinateSystem.WGS84_UTM(48, isNorthHemisphere);

            IProjectedCoordinateSystem google = ProjectedCoordinateSystem.WebMercator;

            transformation = factory.CreateFromCoordinateSystems(vn2000, wgs84); //vn->latlng

            //transformation = factory.CreateFromCoordinateSystems(wgs84, google); //latlng->google
            VietNamTransformation = transformation;

        }

        public static SharpMap.Map Default()
        {
            //Initialize a new map of size 'imagesize'
            SharpMap.Map map = new SharpMap.Map(new Size(1, 1));

            List<ILayer> myList = GetLayersFromDB();
            //myList.AddRange(otherList);

            //==============================================
            foreach (ILayer myVector in myList)
            {
                Layer l = (Layer)myVector;
                l.Enabled = true;
                l.SRID = SourceSRID; //viet nam
                l.TargetSRID = TargetSRID; //chuan latlng

                l.CoordinateTransformation = VietNamTransformation;

                map.Layers.Add(myVector);


            }
            //GeometryTransform.TransformBox(datasource.GetExtents(), Transformation.MathTransform);


            return map;
        }

        public static List<ILayer> GetLayersFromDB()
        {
            //==================================
            List<ILayer> myList = new List<ILayer>();
            List<ILayer> labelList = new List<ILayer>();
            DataTable myData = DBHelper.GetDataTable(@"Select l.* from T_Map_Layer l
                                                        WHERE l.IsActive=1 AND IsShow=1  Order By ShowOrder");

            foreach (DataRow datarow in myData.Rows)
            {
                int layerid = Convert.ToInt32(datarow["Id"]);
                string geometrytype = datarow["GeometryType"].ToString();
                string sharpfilename = datarow["ObjectName"].ToString();
                string layertitle = datarow["Name"].ToString();
                string sharpfilepath = "~/Resource/Map/" + sharpfilename + ".shp";

                DataTable layerConfig = DBHelper.GetDataTable(@"Select c.* , img.Path from T_Map_Layer_Config c
                                                        LEFT JOIN T_Master_Images img ON c.IMG_SymbolId = img.Id
                                                        WHERE c.IsActive=1 AND LayerId=" + layerid);
                if (layerConfig.Rows.Count == 0) continue;
                //===========================================================
                //===========================================================
                DataRow rowConfig = layerConfig.Rows[0];
                #region load style
                bool isTranparentFill = rowConfig.ToBool("Fill_IsTransparent");
                string fillColor = rowConfig.ToString("Fill_Color");
                string lineColor = rowConfig.ToString("Line_Color");
                double MinVisibleLayer = rowConfig.ToDouble("MinVisibleLayer");
                double MaxVisibleLayer = rowConfig.ToDouble("MaxVisibleLayer");

                bool enableOutline = rowConfig.ToBool("Outline_Active");
                string colorOutline = rowConfig.ToString("Outline_Color");
                int widthOutline = rowConfig.ToInt("Outline_Width");

                int widthLine = rowConfig.ToInt("Line_Width");
                string LineDashStyle = rowConfig.ToString("Line_DashStyle");

                bool IsUniqueTheme = false;
                try
                {
                    IsUniqueTheme = rowConfig.ToBool("Fill_IsUniqueTheme");
                }
                catch { }

                bool enableTheme = rowConfig.ToBool("Fill_IsThemeColor");
                string columnName = rowConfig.ToString("Fill_ThemeColumn");
                string themeColor1 = rowConfig.ToString("Fill_ThemeColor1");
                string themeColor2 = rowConfig.ToString("Fill_ThemeColor2");
                string themeColor3 = rowConfig.ToString("Fill_ThemeColor3");
                double minValue = rowConfig.ToDouble("Fill_ThemeMinValue");
                double maxValue = rowConfig.ToDouble("Fill_ThemeMaxValue");

                bool showLabel = rowConfig.ToBool("Label_Active");
                string LabelColumn = rowConfig.ToString("Label_Column");

                int FontSize = rowConfig.ToInt("Text_FontSize");
                string FontName = rowConfig.ToString("Text_FontName");
                string FontColor = rowConfig.ToString("Text_FontColor");
                double MinVisibleLabel = rowConfig.ToDouble("MinVisibleLabel");
                double MaxVisibleLabel = rowConfig.ToDouble("MaxVisibleLabel");
                bool IsHallo = rowConfig.ToBool("Text_IsHallo");

                bool isText = !rowConfig.ToBool("Symbol");
                string textColumn = LabelColumn;
                bool isTextRotation = rowConfig.ToBool("Text_IsRotation");
                string rotationColumn = rowConfig.ToString("Text_RotationColumn");
                bool isSymbol = rowConfig.ToBool("Symbol");

                string symbolPath = rowConfig.ToString("Path");
                #endregion

                try
                {
                    ShapeFile shpfile = new ShapeFile(sharpfilepath, true, true, SourceSRID);
                    string layername = layertitle;// sharpfilename.Trim().Replace(" ", "");
                    
                    //--------------------------------------
                    //--------------------------------------
                    //--------------------------------------
                    //--------------------------------------
                    //if (isSymbol)
                    if (geometrytype == "Point")
                    {
                        if (isSymbol)
                        {
                            #region symbol

                            SharpMap.Layers.VectorLayer symbolLayer = new VectorLayer(layername + " (biểu tượng)"); //layername + "_symbol"
                            symbolLayer.Enabled = true;

                            symbolLayer.Style = new SharpMap.Styles.VectorStyle();
                            symbolLayer.Style.Fill = new SolidBrush(Color.White);
                            symbolLayer.Style.Outline = System.Drawing.Pens.Black;
                            symbolLayer.Style.Outline = new Pen(Color.Black, 1);
                            symbolLayer.Style.Outline.DashStyle = DashStyle.Solid;
                            symbolLayer.Style.EnableOutline = true;
                            symbolLayer.Style.SymbolScale = 1;
                            symbolLayer.MinVisible = MinVisibleLabel;
                            symbolLayer.MaxVisible = MaxVisibleLabel;
                            symbolLayer.Style.Enabled = true;
                            symbolLayer.SRID = 4326;
                            try
                            {
                                Bitmap myBitmap = new Bitmap(symbolPath);
                                symbolLayer.Style.Symbol = myBitmap;
                            }
                            catch (Exception eex)
                            {
                                throw new Exception("Không tồn tại symbol: " + symbolPath, eex);
                            }

                            labelList.Add(symbolLayer);
                            #endregion
                        }
                        //--------------------------------------
                        else //if (isText)
                        {
                            #region text
                            SharpMap.Layers.LabelLayer textLayer = new SharpMap.Layers.LabelLayer(layername);
                            textLayer.Enabled = true;
                            textLayer.DataSource = shpfile;

                            textLayer.LabelColumn = textColumn;
                            if (isTextRotation)
                                textLayer.RotationColumn = rotationColumn;
                            textLayer.Style = new SharpMap.Styles.LabelStyle();
                            textLayer.Style.ForeColor = ColorHelper.FromHex(FontColor);

                            textLayer.Style.Font = new Font(FontName, FontSize, FontStyle.Regular);

                            textLayer.Style.BackColor = new System.Drawing.SolidBrush(Color.Empty);

                            if (IsHallo)
                                textLayer.Style.Halo = new Pen(Color.WhiteSmoke, 2);

                            //is text on path sharpmap v2

                            textLayer.MaxVisible = MaxVisibleLabel;
                            textLayer.MinVisible = MinVisibleLabel;
                            textLayer.Style.HorizontalAlignment = SharpMap.Styles.LabelStyle.HorizontalAlignmentEnum.Left;
                            textLayer.Style.VerticalAlignment = SharpMap.Styles.LabelStyle.VerticalAlignmentEnum.Bottom;
                            textLayer.SRID = 4326;
                            labelList.Add(textLayer);
                            #endregion
                        }
                    }
                    //--------------------------------------
                    else
                    {
                        #region normal
                        SharpMap.Layers.VectorLayer myVector = new VectorLayer(layername);
                        myVector.Enabled = true;
                        myVector.DataSource = shpfile;
                        //
                        myVector.Style.Line = new Pen(ColorHelper.FromHex(lineColor), float.Parse(widthLine.ToString()));
                        myVector.Style.Line.DashStyle = ((LineDashStyle.ToUpper().Equals("DASH")) ? DashStyle.Dash : DashStyle.Solid);
                        //


                        myVector.Style.Fill = new SolidBrush(ColorHelper.FromHex(fillColor));

                        if (isTranparentFill)
                            myVector.Style.Fill = new SolidBrush(Color.Transparent);

                        myVector.SRID = 4326;

                        myVector.MinVisible = MinVisibleLayer;
                        myVector.MaxVisible = MaxVisibleLayer;

                        if (enableOutline)
                        {
                            myVector.Style.EnableOutline = true;
                            myVector.Style.Outline = new Pen(ColorHelper.FromHex(colorOutline), float.Parse(widthOutline.ToString()));
                            myVector.Style.Outline.DashStyle = ((LineDashStyle.ToUpper().Equals("DASH")) ? DashStyle.Dash : DashStyle.Solid);
                        }

                        if (enableTheme)
                        {
                            VectorStyle min = new VectorStyle();
                            min.Line = new Pen(ColorHelper.FromHex(lineColor), float.Parse(widthLine.ToString()));
                            min.EnableOutline = enableOutline;
                            min.Outline = new Pen(ColorHelper.FromHex(colorOutline), float.Parse(widthOutline.ToString()));

                            VectorStyle max = new VectorStyle();
                            max.Line = new Pen(ColorHelper.FromHex(lineColor), float.Parse(widthLine.ToString()));
                            max.EnableOutline = enableOutline;
                            max.Outline = new Pen(ColorHelper.FromHex(colorOutline), float.Parse(widthOutline.ToString()));

                            GradientTheme popdens = new GradientTheme(columnName, minValue, maxValue, min, max);
                            Color Color1 = ColorHelper.FromHex(themeColor1);
                            Color Color2 = ColorHelper.FromHex(themeColor2);
                            Color Color3 = ColorHelper.FromHex(themeColor3);
                            popdens.FillColorBlend = SharpMap.Rendering.Thematics.ColorBlend.ThreeColors(Color1, Color2, Color3);
                            popdens.LineColorBlend = SharpMap.Rendering.Thematics.ColorBlend.ThreeColors(Color.Black, Color.Black, Color.Black);
                            myVector.Theme = popdens;


                        }

                        if (IsUniqueTheme)
                        {
                            #region uniquetheme
                            //Create the style for Land
                            SharpMap.Styles.VectorStyle defaultStyle = new SharpMap.Styles.VectorStyle();
                            defaultStyle.Fill = new System.Drawing.SolidBrush(Color.White);
                            defaultStyle.EnableOutline = enableOutline;
                            defaultStyle.Outline = new Pen(ColorHelper.FromHex(colorOutline), float.Parse(widthOutline.ToString()));

                            //Create the style for Water
                            SharpMap.Styles.VectorStyle waterStyle = new SharpMap.Styles.VectorStyle();
                            waterStyle.Fill = new System.Drawing.SolidBrush(Color.Black);

                            //Create the theme items
                            Dictionary<string, SharpMap.Styles.IStyle> styles = new Dictionary<string, SharpMap.Styles.IStyle>();
                            if (datarow["LayerTableName"].ToString() == "Dat_Sre_Final_region")
                            {
                                List<int> kyhieus = new List<int>(){0   ,12114  ,16112  ,17311  ,17605  ,18505  ,19215  ,
                                        20312   ,21112  ,22110  ,22342  ,23110  ,24110  ,25110  ,26110  ,26120  ,27110  ,29110  ,
                                        30212   ,30222  ,30312  ,30413  ,30623  ,30624  ,30632  ,31142  ,32511  ,33432  ,33433  ,33512  ,
                                        33533   ,33543  ,33611  ,33612  ,33613  ,33614  ,33624  ,33630  ,33633  ,33634  ,33642  ,33643  ,
                                        33653   ,34113  ,35131  ,35633  ,36114  ,39112  ,
                                        40132   ,41000  ,42215  ,43413  ,44115  ,45313  ,46234  ,47125  ,47215  ,48253  ,49613  ,
                                        50235   ,51114  ,52444  ,53354    };
                                foreach (int i in kyhieus)
                                {
                                    Color c = Color.White;
                                    c = Color.FromArgb(-i * 100);

                                    SharpMap.Styles.VectorStyle style = new SharpMap.Styles.VectorStyle();
                                    style.Fill = new System.Drawing.SolidBrush(c);
                                    style.EnableOutline = enableOutline;
                                    style.Outline = new Pen(ColorHelper.FromHex(colorOutline), float.Parse(widthOutline.ToString()));
                                    styles.Add("" + i.ToString(), style);

                                }
                            }
                            else if (datarow["CatName"].ToString() == "HIENTRANG_SUDUNGDAT")
                            {
                                List<int> kyhieus = new List<int>() { 4, 3, 1, 2, 6, 7, 5 };
                                List<string> colors = new List<string>() { "54FF00", "D0FF73", "DF72FF", "005CE7", "FFD380", "E7E600", "CD6667" };
                                for (int i = 0; i < kyhieus.Count; i++)
                                {
                                    Color c = Color.White;
                                    // c = Color.FromArgb(-i * 1000 - 10000);
                                    c = ColorTranslator.FromHtml("#" + colors[i]);
                                    SharpMap.Styles.VectorStyle style = new SharpMap.Styles.VectorStyle();
                                    style.Fill = new System.Drawing.SolidBrush(c);
                                    style.EnableOutline = enableOutline;
                                    style.Outline = new Pen(ColorHelper.FromHex(colorOutline), float.Parse(widthOutline.ToString()));
                                    styles.Add("" + kyhieus[i], style);

                                }
                            }
                            //Assign the theme
                            UniqueValuesTheme<string> theme = new UniqueValuesTheme<string>(columnName, styles, defaultStyle);
                            myVector.Theme = theme;
                            #endregion
                        }


                        myList.Add(myVector);
                        #endregion
                    }

                    //======================================
                    //======================================
                    //======================================
                    if (showLabel)
                    {
                        #region show label of layer
                        SharpMap.Layers.LabelLayer myLabel = new SharpMap.Layers.LabelLayer(layername + " (tên)"); //layername + "_label"
                        myLabel.DataSource = shpfile;
                        myLabel.Enabled = true;
                        myLabel.LabelColumn = LabelColumn;

                        //myLabel.Style = new SharpMap.Styles.LabelStyle();

                        myLabel.Style.ForeColor = ColorHelper.FromHex(FontColor);
                        myLabel.Style.Font = new Font(FontName, FontSize, FontStyle.Regular);
                        myLabel.Style.BackColor = new System.Drawing.SolidBrush(Color.Empty);
                        if (IsHallo)
                            myLabel.Style.Halo = new Pen(Color.WhiteSmoke, 2);

                        myLabel.MaxVisible = MaxVisibleLabel;
                        myLabel.MinVisible = MinVisibleLabel;
                        myLabel.Style.HorizontalAlignment = LabelStyle.HorizontalAlignmentEnum.Left;
                        myLabel.Style.VerticalAlignment = LabelStyle.VerticalAlignmentEnum.Bottom;

                        if (isSymbol) myLabel.Style.Offset = new PointF(1, 1);
                        myLabel.SRID = 4326;
                        myLabel.MultipartGeometryBehaviour = LabelLayer.MultipartGeometryBehaviourEnum.Largest;
                        //---------------------------
                        //if (shpfile.ShapeType == ShapeType.PolyLine)
                        {
                            myLabel.Style.HorizontalAlignment = LabelStyle.HorizontalAlignmentEnum.Center;
                            myLabel.Style.VerticalAlignment = LabelStyle.VerticalAlignmentEnum.Top;
                            myLabel.Style.IsTextOnPath = true;
                        }

                        labelList.Add(myLabel);
                        #endregion
                    }
                }
                catch (Exception ex)
                {
                    string msg = string.Format("ERROR Load Layer : " + sharpfilepath + ". InnerEX: " + ex.Message);
                    //throw new Exception(msg);
                }
                //////////end for///////////////////////
            }
            //====================

            myList.AddRange(labelList);

            return myList;
        }

        public static ShapeFileInfo ReadShapeFile(string filePath, 
            IMapRender mapRender = null,
            bool readImage = true,
            bool readFeatureData = true)
        {
            ShapeFileInfo info = new ShapeFileInfo();
            ShapeFile sf = null;
            try
            {
                sf = new ShapeFile(filePath, true);              
                var ext = sf.GetExtents();
                info.Extents = ext;
                info.GeometryType = sf.ShapeType;
                info.SRID = sf.SRID;
                info.FeatureCount = sf.GetFeatureCount();

                if (readFeatureData)
                {
                    ReadFeatureData(sf, info);
                }
                if (readImage && mapRender!=null)
                {
                    var image = mapRender.RenderImage(sf, new MapRenderOptions()
                    {
                        PixelWidth = 512,
                        BackgroundColor = Color.White,
                        IsCalculateZoom = false
                    });
                    info.Image = image;
                }
                sf.Dispose();
            }
            catch (Exception ex)
            {
                if (sf != null) sf.Close();
                throw ex;
            }
           
            return info;
        }

        private static void ReadFeatureData(ShapeFile sf, ShapeFileInfo info)
        {
            var columns = new List<ShapeFileColumn>();
            var featureData = new List<Dictionary<string, object>>();

            var ext = sf.GetExtents();
            sf.Open();
            FeatureDataSet ds = new FeatureDataSet();
            sf.ExecuteIntersectionQuery(ext, ds);
            FeatureDataTable table = ds.Tables[0];
            for (int j = 0; j < table.Columns.Count; j++)
            {
                DataColumn col = table.Columns[j];
                columns.Add(new ShapeFileColumn()
                {
                    Name = col.ColumnName,
                    Type = col.DataType.Name
                });
            }

            if (table.Rows.Count <= 1000)
            {
                foreach (FeatureDataRow row in table.Rows)
                {
                    Dictionary<string, object> data = new Dictionary<string, object>();
                    for (int j = 0; j < table.Columns.Count; j++)
                    {
                        DataColumn col = table.Columns[j];
                        var obj = row[col];
                        data.Add(col.ColumnName, obj);
                    }
                    featureData.Add(data);
                }
            }

            sf.Close();
            info.Columns = columns;
            info.AttributeData = featureData;
        }
    }


    public class ShapeFileInfo
    {
        public ShapeType GeometryType;
        public List<ShapeFileColumn> Columns;
        public List<Dictionary<string, object>> AttributeData;
        public int SRID { get; set; }
        public Envelope Extents { get; set; }
        public int FeatureCount { get; set; }
        public Image Image { get; set; }

        public ShapeFileInfo()
        {
            SRID = 0;
            this.Columns = new List<ShapeFileColumn>();
            this.AttributeData = new List<Dictionary<string, object>>();
        }
    }

    public class ShapeFileColumn
    {
        public string Name { get; set; }
        public string Type { get; set; }
    }

}
