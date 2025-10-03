// app/stores/add-edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Plus, Trash2, Store, Globe, Mail, Phone, MapPin, Share2, Palette } from "lucide-react";
import Link from "next/link";

// Mock categories
const categories = [
  { id: "1", name: "Fashion" },
  { id: "2", name: "Electronics" },
  { id: "3", name: "Home & Garden" },
  { id: "4", name: "Grocery" },
  { id: "5", name: "Health & Beauty" },
  { id: "6", name: "Sports" },
];

// Mock store data for editing
const mockStoreData = {
  "_id": "68bd6b50df60e95ab4f5aceb",
  "name": "Dhaneri",
  "domain": "newstore.example.com",
  "category_id": {
    "_id": "68bd6b43df60e95ab4f5ace5",
    "name": "Fashion",
    "id": "68bd6b43df60e95ab4f5ace5"
  },
  "config": {
    "enabledCategory": "Fashion",
    "contact_info": {
      "email": "dhaneri16@gmail.com",
      "phone": "000000000",
      "website": "https://dhaneri.com"
    },
    "address": {
      "street": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "postal_code": "10001"
    },
    "social_media": {
      "facebook": "dhaneri",
      "twitter": "dhaneri",
      "instagram": "dhaneri.official",
      "linkedin": "dhaneri"
    }
  },
  "is_active": true,
  "theme": {
    "_id": "68bd6174df60e95ab4f5ac87",
    "primary_color": "#4f46e5",
    "secondary_color": "#f43f5e",
    "font_family": "'Inter', sans-serif",
    "id": "68bd6174df60e95ab4f5ac87"
  },
  "features": ["Online Payments", "Inventory Management"],
  "attributes": [],
  "created_at": "2025-09-07T11:24:00.844Z",
  "updated_at": "2025-09-09T09:28:41.243Z",
  "id": "68bd6b50df60e95ab4f5aceb"
};

export default function AddEditStorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get('id');
  const isEditMode = Boolean(storeId);

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    domain: "",
    category_id: "",
    is_active: true,

    // Contact Information
    contact_info: {
      email: "",
      phone: "",
      website: ""
    },

    // Address
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      postal_code: ""
    },

    // Social Media
    social_media: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: ""
    },

    // Theme
    theme: {
      primary_color: "#4f46e5",
      secondary_color: "#f43f5e",
      font_family: "'Inter', sans-serif"
    },

    // Features
    features: [] as string[],

    // Description
    description: ""
  });

  const [newFeature, setNewFeature] = useState("");

  // Load store data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      // Simulate API call to fetch store data
      setIsLoading(true);
      setTimeout(() => {
        setFormData({
          name: mockStoreData.name,
          domain: mockStoreData.domain,
          category_id: mockStoreData.category_id._id,
          is_active: mockStoreData.is_active,
          contact_info: { ...mockStoreData.config.contact_info },
          address: { ...mockStoreData.config.address },
          social_media: { ...mockStoreData.config.social_media },
          theme: { ...mockStoreData.theme },
          features: [...mockStoreData.features],
          description: ""
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [isEditMode]);

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section: string, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [subsection]: {
          ...(prev[section as keyof typeof prev] as any)[subsection],
          [field]: value
        }
      }
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Form submitted:", formData);
      // Redirect to stores page after successful submission
      router.push("/stores");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditMode) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center space-x-4">
          <div className="animate-pulse h-8 w-8 bg-muted rounded"></div>
          <div className="animate-pulse h-8 w-64 bg-muted rounded"></div>
        </div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/stores">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Stores
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditMode ? `Edit ${formData.name}` : "Add New Store"}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode ? "Update your store information" : "Create a new store for your business"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => router.push("/stores")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Store"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Enter the basic details about your store
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Store Name *</Label>
                        <Input
                          id="name"
                          placeholder="Enter store name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("", "name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="domain">Domain *</Label>
                        <Input
                          id="domain"
                          placeholder="yourstore.example.com"
                          value={formData.domain}
                          onChange={(e) => handleInputChange("", "domain", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.category_id}
                          onValueChange={(value) => handleInputChange("", "category_id", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Brief description of your store"
                          value={formData.description}
                          onChange={(e) => handleInputChange("", "description", e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => handleInputChange("", "is_active", checked)}
                      />
                      <Label htmlFor="is_active">Store is active</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contact Information Tab */}
              <TabsContent value="contact" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                      How customers can get in touch with your store
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <Mail className="h-5 w-5 mr-2" />
                        Contact Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="contact@store.com"
                            value={formData.contact_info.email}
                            onChange={(e) => handleNestedInputChange("contact_info", "", "email", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            placeholder="+1 (555) 123-4567"
                            value={formData.contact_info.phone}
                            onChange={(e) => handleNestedInputChange("contact_info", "", "phone", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          placeholder="https://yourstore.com"
                          value={formData.contact_info.website}
                          onChange={(e) => handleNestedInputChange("contact_info", "", "website", e.target.value)}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Address
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                          id="street"
                          placeholder="123 Main Street"
                          value={formData.address.street}
                          onChange={(e) => handleNestedInputChange("address", "", "street", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="New York"
                            value={formData.address.city}
                            onChange={(e) => handleNestedInputChange("address", "", "city", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State/Province</Label>
                          <Input
                            id="state"
                            placeholder="NY"
                            value={formData.address.state}
                            onChange={(e) => handleNestedInputChange("address", "", "state", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            placeholder="United States"
                            value={formData.address.country}
                            onChange={(e) => handleNestedInputChange("address", "", "country", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postal_code">Postal Code</Label>
                          <Input
                            id="postal_code"
                            placeholder="10001"
                            value={formData.address.postal_code}
                            onChange={(e) => handleNestedInputChange("address", "", "postal_code", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <Share2 className="h-5 w-5 mr-2" />
                        Social Media
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="facebook">Facebook</Label>
                          <Input
                            id="facebook"
                            placeholder="username"
                            value={formData.social_media.facebook}
                            onChange={(e) => handleNestedInputChange("social_media", "", "facebook", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twitter">Twitter</Label>
                          <Input
                            id="twitter"
                            placeholder="username"
                            value={formData.social_media.twitter}
                            onChange={(e) => handleNestedInputChange("social_media", "", "twitter", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="instagram">Instagram</Label>
                          <Input
                            id="instagram"
                            placeholder="username"
                            value={formData.social_media.instagram}
                            onChange={(e) => handleNestedInputChange("social_media", "", "instagram", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            placeholder="username"
                            value={formData.social_media.linkedin}
                            onChange={(e) => handleNestedInputChange("social_media", "", "linkedin", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Store Appearance</CardTitle>
                    <CardDescription>
                      Customize the look and feel of your store
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <Palette className="h-5 w-5 mr-2" />
                        Theme Colors
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="primary_color">Primary Color</Label>
                          <div className="flex space-x-2">
                            <Input
                              id="primary_color"
                              value={formData.theme.primary_color}
                              onChange={(e) => handleNestedInputChange("theme", "", "primary_color", e.target.value)}
                            />
                            <div
                              className="w-12 h-10 rounded border"
                              style={{ backgroundColor: formData.theme.primary_color }}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="secondary_color">Secondary Color</Label>
                          <div className="flex space-x-2">
                            <Input
                              id="secondary_color"
                              value={formData.theme.secondary_color}
                              onChange={(e) => handleNestedInputChange("theme", "", "secondary_color", e.target.value)}
                            />
                            <div
                              className="w-12 h-10 rounded border"
                              style={{ backgroundColor: formData.theme.secondary_color }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="font_family">Font Family</Label>
                      <Select
                        value={formData.theme.font_family}
                        onValueChange={(value) => handleNestedInputChange("theme", "", "font_family", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select font family" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="'Inter', sans-serif">Inter</SelectItem>
                          <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                          <SelectItem value="'Open Sans', sans-serif">Open Sans</SelectItem>
                          <SelectItem value="'Playfair Display', serif">Playfair Display</SelectItem>
                          <SelectItem value="'Nunito', sans-serif">Nunito</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Theme Preview */}
                    <div className="space-y-4">
                      <Label>Theme Preview</Label>
                      <div className="border rounded-lg p-6 space-y-4" style={{ fontFamily: formData.theme.font_family }}>
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: formData.theme.primary_color }}
                          >
                            S
                          </div>
                          <div>
                            <h4 className="font-semibold" style={{ color: formData.theme.primary_color }}>
                              {formData.name || "Store Name"}
                            </h4>
                            <p className="text-sm text-muted-foreground">Theme Preview</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            style={{ backgroundColor: formData.theme.primary_color }}
                          >
                            Primary Button
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            style={{
                              borderColor: formData.theme.secondary_color,
                              color: formData.theme.secondary_color
                            }}
                          >
                            Secondary Button
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value="features" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Store Features</CardTitle>
                    <CardDescription>
                      Enable features and capabilities for your store
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter a feature"
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addFeature();
                            }
                          }}
                        />
                        <Button type="button" onClick={addFeature}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {formData.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                            <span>{feature}</span>
                            <button
                              type="button"
                              onClick={() => removeFeature(feature)}
                              className="ml-1 hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {formData.features.length === 0 && (
                          <p className="text-sm text-muted-foreground">No features added yet</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Available Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          "Online Payments",
                          "Inventory Management",
                          "Customer Reviews",
                          "Wishlist",
                          "Multi-language",
                          "Multi-currency",
                          "SEO Tools",
                          "Analytics Dashboard"
                        ].map((feature) => (
                          <div key={feature} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={feature}
                              checked={formData.features.includes(feature)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    features: [...prev.features, feature]
                                  }));
                                } else {
                                  removeFeature(feature);
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor={feature} className="text-sm">
                              {feature}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Store Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Store"}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push("/stores")}>
                  Cancel
                </Button>

                {isEditMode && (
                  <>
                    <Separator />
                    <Button variant="outline" className="w-full">
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Store
                    </Button>
                    <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Store
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Store Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 border rounded-lg">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-3"
                    style={{ backgroundColor: formData.theme.primary_color }}
                  >
                    {formData.name ? formData.name.charAt(0) : "S"}
                  </div>
                  <h3 className="font-semibold truncate">{formData.name || "Store Name"}</h3>
                  <p className="text-sm text-muted-foreground truncate">{formData.domain || "example.com"}</p>
                  <Badge variant={formData.is_active ? "default" : "secondary"} className="mt-2">
                    {formData.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={formData.is_active ? "default" : "secondary"}>
                      {formData.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{isEditMode ? "Sep 7, 2025" : "Now"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span>{isEditMode ? "2 days ago" : "Never"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Features:</span>
                    <span>{formData.features.length} enabled</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}